import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get user subscription by userId
 */
export const getUserSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // Return default free tier if no subscription exists
    if (!subscription) {
      return {
        userId,
        tier: "free" as const,
        status: "active" as const,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    return subscription;
  },
});

/**
 * Get subscription by Stripe customer ID
 */
export const getSubscriptionByCustomerId = query({
  args: { customerId: v.string() },
  handler: async (ctx, { customerId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", customerId)
      )
      .first();
  },
});

/**
 * Get subscription by Stripe subscription ID
 */
export const getSubscriptionBySubscriptionId = query({
  args: { subscriptionId: v.string() },
  handler: async (ctx, { subscriptionId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", subscriptionId)
      )
      .first();
  },
});

/**
 * Create or update user subscription
 */
export const updateUserSubscription = mutation({
  args: {
    userId: v.string(),
    tier: v.optional(
      v.union(
        v.literal("free"),
        v.literal("starter"),
        v.literal("pro"),
        v.literal("agency")
      )
    ),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("canceled"),
        v.literal("past_due"),
        v.literal("trialing"),
        v.literal("incomplete")
      )
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    priceId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    // Check if subscription exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        ...updates,
        updatedAt: now,
      });

      return { ...existing, ...updates, updatedAt: now };
    } else {
      // Create new subscription
      const newSubscription = {
        userId,
        tier: args.tier || "free",
        status: args.status || "active",
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        priceId: args.priceId,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        createdAt: now,
        updatedAt: now,
      };

      await ctx.db.insert("subscriptions", newSubscription);
      return newSubscription;
    }
  },
});

/**
 * Get user usage for current period
 */
export const getUserUsage = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    const currentPeriodStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();

    const usage = await ctx.db
      .query("usage")
      .withIndex("by_period", (q) =>
        q.eq("userId", userId).eq("periodStart", currentPeriodStart)
      )
      .first();

    if (!usage) {
      return {
        userId,
        aiGenerations: 0,
        periodStart: currentPeriodStart,
        periodEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getTime(),
      };
    }

    return usage;
  },
});

/**
 * Track usage (increment AI generations)
 */
export const trackUsage = mutation({
  args: {
    userId: v.string(),
    type: v.literal("aiGenerations"),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { userId, type, count = 1 }) => {
    const now = Date.now();
    const currentPeriodStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();
    const currentPeriodEnd = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getTime();

    // Check if usage record exists for current period
    const existing = await ctx.db
      .query("usage")
      .withIndex("by_period", (q) =>
        q.eq("userId", userId).eq("periodStart", currentPeriodStart)
      )
      .first();

    if (existing) {
      // Update existing usage
      await ctx.db.patch(existing._id, {
        aiGenerations: existing.aiGenerations + count,
        updatedAt: now,
      });
    } else {
      // Create new usage record
      await ctx.db.insert("usage", {
        userId,
        aiGenerations: count,
        periodStart: currentPeriodStart,
        periodEnd: currentPeriodEnd,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Track analytics event
 */
export const trackAnalytics = mutation({
  args: {
    userId: v.string(),
    event: v.string(),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, { userId, event, properties }) => {
    await ctx.db.insert("analyticsEvents", {
      userId,
      event,
      properties,
      timestamp: Date.now(),
    });
  },
});
