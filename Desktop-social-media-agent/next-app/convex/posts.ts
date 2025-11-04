import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Posts Mutations and Queries
 *
 * Handle CRUD operations for user content posts
 */

// Create a new post
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.optional(v.string()),
    url: v.optional(v.string()),
    field1: v.optional(v.string()),
    field2: v.optional(v.string()),
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const postId = await ctx.db.insert("posts", {
      userId: identity.subject,
      title: args.title,
      content: args.content,
      tags: args.tags,
      url: args.url,
      field1: args.field1,
      field2: args.field2,
      contentType: args.contentType,
      used: false,
      createdAt: Date.now(),
    });

    return postId;
  },
});

// Get all posts for current user by content type
export const getPostsByType = query({
  args: {
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", identity.subject).eq("contentType", args.contentType)
      )
      .order("desc")
      .collect();

    return posts;
  },
});

// Get all posts for current user
export const getAllPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return posts;
  },
});

// Update a post
export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.string()),
    url: v.optional(v.string()),
    field1: v.optional(v.string()),
    field2: v.optional(v.string()),
    used: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { id, ...updates } = args;

    // Verify ownership
    const post = await ctx.db.get(id);
    if (!post || post.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify ownership
    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Mark post as used
export const markPostAsUsed = mutation({
  args: {
    id: v.id("posts"),
    used: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, { used: args.used });
    return args.id;
  },
});

// Get post statistics
export const getPostStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { totalPosts: 0, usedPosts: 0, availablePosts: 0 };

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    const usedPosts = posts.filter((p) => p.used).length;

    return {
      totalPosts: posts.length,
      usedPosts,
      availablePosts: posts.length - usedPosts,
    };
  },
});
