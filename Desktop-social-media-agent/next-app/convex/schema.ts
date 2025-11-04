import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema for Post Planner
 *
 * This defines the structure of all data tables in your Convex database
 */

export default defineSchema({
  // User content posts by category
  posts: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(),
    content: v.string(),
    tags: v.optional(v.string()),
    url: v.optional(v.string()),
    field1: v.optional(v.string()),
    field2: v.optional(v.string()),
    contentType: v.string(), // 'recipes', 'workouts', etc.
    used: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "contentType"])
    .index("by_created", ["createdAt"]),

  // Scheduled content calendar
  scheduledContent: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    date: v.string(), // ISO date string
    time: v.string(),
    platform: v.string(), // 'instagram', 'facebook', 'linkedin', etc.
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_status", ["status"]),

  // Weekly presets
  presets: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    schedule: v.object({
      monday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
      tuesday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
      wednesday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
      thursday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
      friday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
      saturday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
      sunday: v.object({
        enabled: v.boolean(),
        topic: v.string(),
        time: v.string(),
      }),
    }),
    platforms: v.object({
      instagram: v.boolean(),
      linkedin: v.boolean(),
      facebook: v.boolean(),
    }),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  // Custom categories
  customCategories: defineTable({
    userId: v.string(),
    categoryKey: v.string(), // lowercase key like 'travel', 'fitness'
    categoryName: v.string(), // Display name
    categoryIcon: v.string(), // Emoji icon
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_key", ["userId", "categoryKey"]),
});
