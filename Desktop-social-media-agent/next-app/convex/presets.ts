import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Weekly Presets Mutations and Queries
 *
 * Handle weekly posting schedule presets
 */

const daySchedule = v.object({
  enabled: v.boolean(),
  topic: v.string(),
  time: v.string(),
});

const scheduleObject = v.object({
  monday: daySchedule,
  tuesday: daySchedule,
  wednesday: daySchedule,
  thursday: daySchedule,
  friday: daySchedule,
  saturday: daySchedule,
  sunday: daySchedule,
});

const platformsObject = v.object({
  instagram: v.boolean(),
  linkedin: v.boolean(),
  facebook: v.boolean(),
});

// Create a new preset
export const createPreset = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    schedule: scheduleObject,
    platforms: platformsObject,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const presetId = await ctx.db.insert("presets", {
      userId: identity.subject,
      ...args,
      createdAt: Date.now(),
    });

    return presetId;
  },
});

// Get all presets for user
export const getPresets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const presets = await ctx.db
      .query("presets")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return presets;
  },
});

// Update a preset
export const updatePreset = mutation({
  args: {
    id: v.id("presets"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    schedule: v.optional(scheduleObject),
    platforms: v.optional(platformsObject),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { id, ...updates } = args;

    // Verify ownership
    const preset = await ctx.db.get(id);
    if (!preset || preset.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a preset
export const deletePreset = mutation({
  args: {
    id: v.id("presets"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify ownership
    const preset = await ctx.db.get(args.id);
    if (!preset || preset.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
