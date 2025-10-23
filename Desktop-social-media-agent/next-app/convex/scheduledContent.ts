import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Scheduled Content Mutations and Queries
 *
 * Handle calendar scheduling functionality
 */

// Create scheduled content
export const createScheduledContent = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    date: v.string(),
    time: v.string(),
    platform: v.string(),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const contentId = await ctx.db.insert("scheduledContent", {
      userId: identity.subject,
      ...args,
      createdAt: Date.now(),
    });

    return contentId;
  },
});

// Get all scheduled content for user
export const getScheduledContent = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const content = await ctx.db
      .query("scheduledContent")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    return content.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  },
});

// Get scheduled content by date
export const getScheduledContentByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const content = await ctx.db
      .query("scheduledContent")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", identity.subject).eq("date", args.date)
      )
      .collect();

    return content.sort((a, b) => a.time.localeCompare(b.time));
  },
});

// Update scheduled content
export const updateScheduledContent = mutation({
  args: {
    id: v.id("scheduledContent"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    platform: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { id, ...updates } = args;

    // Verify ownership
    const content = await ctx.db.get(id);
    if (!content || content.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete scheduled content
export const deleteScheduledContent = mutation({
  args: {
    id: v.id("scheduledContent"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify ownership
    const content = await ctx.db.get(args.id);
    if (!content || content.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get scheduled content count
export const getScheduledContentCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const content = await ctx.db
      .query("scheduledContent")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    return content.length;
  },
});
