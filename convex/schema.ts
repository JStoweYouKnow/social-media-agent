import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema
 *
 * This defines the structure of your database tables.
 */

export default defineSchema({
  // User Subscriptions
  subscriptions: defineTable({
    userId: v.string(), // Clerk user ID
    tier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("pro"),
      v.literal("agency")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing"),
      v.literal("incomplete")
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    priceId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()), // Unix timestamp
    cancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

  // Usage Tracking (monthly)
  usage: defineTable({
    userId: v.string(),
    aiGenerations: v.number(),
    periodStart: v.number(), // Unix timestamp
    periodEnd: v.number(), // Unix timestamp
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_period", ["userId", "periodStart"]),

  // Analytics Events (optional - for tracking user behavior)
  analyticsEvents: defineTable({
    userId: v.string(),
    event: v.string(),
    properties: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_event", ["event"])
    .index("by_timestamp", ["timestamp"]),
});
