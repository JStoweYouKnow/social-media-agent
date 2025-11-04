# Convex Integration Setup Guide

This guide will walk you through completing the Convex database integration for Post Planner.

## What's Already Done ✅

1. ✅ Installed `convex` package
2. ✅ Created Convex schema with tables for:
   - Posts (user content by category)
   - Scheduled content (calendar)
   - Presets (weekly posting schedules)
   - Custom categories
3. ✅ Created Convex functions (queries & mutations) for all data operations
4. ✅ Set up Convex authentication with Clerk
5. ✅ Created `ConvexClientProvider` component
6. ✅ Updated app layout to use Convex provider
7. ✅ Added environment variable placeholders

## What You Need to Do 🚀

### Step 1: Initialize Convex Project

Run this command in your terminal:

```bash
cd /Users/v/Desktop-social-media-agent/next-app
npx convex dev
```

This will:
1. Prompt you to login to Convex (use GitHub recommended)
2. Create a new project on Convex
3. Generate your deployment URL and keys
4. Automatically update your `.env.local` with:
   - `CONVEX_DEPLOYMENT`
   - `NEXT_PUBLIC_CONVEX_URL`

### Step 2: Configure Clerk JWT Template for Convex

Convex needs a special JWT token from Clerk to authenticate users.

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application ("special-boar-17")
3. Navigate to **JWT Templates** (in left sidebar)
4. Click **"New template"**
5. Select **"Convex"** from the template list
6. This creates a template named "convex"
7. Copy the **Issuer URL** shown (looks like `https://your-app.clerk.accounts.dev`)
8. Add to your `.env.local`:
   ```env
   CLERK_JWT_ISSUER_DOMAIN=https://special-boar-17.clerk.accounts.dev
   ```

### Step 3: Verify Environment Variables

Your `.env.local` should now have all these values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex Database
CONVEX_DEPLOYMENT=prod:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk JWT Issuer for Convex
CLERK_JWT_ISSUER_DOMAIN=https://special-boar-17.clerk.accounts.dev
```

### Step 4: Keep Convex Dev Running

After `npx convex dev` completes setup, it will keep running to:
- Watch for changes in `convex/` directory
- Sync your schema and functions to the cloud
- Show real-time logs

**Keep this terminal open while developing!**

In a **new terminal tab**, run your Next.js app:

```bash
cd /Users/v/Desktop-social-media-agent/next-app
npm run dev
```

### Step 5: Test the Integration

1. Visit `http://localhost:3000`
2. Sign in with your Clerk account
3. The app should now be connected to Convex database!

## Database Schema Overview

### Posts Table
Stores all user content (recipes, workouts, etc.)
```typescript
{
  userId: string;        // Clerk user ID
  title: string;
  content: string;
  tags?: string;
  contentType: string;   // 'recipes', 'workouts', etc.
  used?: boolean;        // Track if post was used
  createdAt: number;
}
```

### Scheduled Content Table
Calendar scheduling
```typescript
{
  userId: string;
  title: string;
  content: string;
  date: string;          // ISO date
  time: string;
  platform: string;      // 'instagram', 'linkedin', etc.
  status: 'draft' | 'scheduled' | 'published';
  createdAt: number;
}
```

### Presets Table
Weekly posting schedules
```typescript
{
  userId: string;
  name: string;
  description: string;
  schedule: {            // Full week schedule
    monday: { enabled, topic, time },
    tuesday: { enabled, topic, time },
    // ... etc
  };
  platforms: {
    instagram: boolean;
    linkedin: boolean;
    facebook: boolean;
  };
  createdAt: number;
}
```

## Available Functions

### Posts (`convex/posts.ts`)
- `createPost` - Create new content
- `getPostsByType` - Get posts by category
- `getAllPosts` - Get all user posts
- `updatePost` - Update existing post
- `deletePost` - Remove post
- `markPostAsUsed` - Mark content as used
- `getPostStats` - Get statistics

### Scheduled Content (`convex/scheduledContent.ts`)
- `createScheduledContent` - Schedule new post
- `getScheduledContent` - Get all scheduled items
- `getScheduledContentByDate` - Get by specific date
- `updateScheduledContent` - Update scheduled item
- `deleteScheduledContent` - Remove scheduled item
- `getScheduledContentCount` - Get total count

### Presets (`convex/presets.ts`)
- `createPreset` - Create weekly schedule
- `getPresets` - Get all presets
- `updatePreset` - Update preset
- `deletePreset` - Remove preset

## Next Steps: Integrate with UI

Now that Convex is set up, you can replace localStorage with database queries:

### Example: Fetch Posts in Component

```typescript
'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function ContentManager() {
  // Fetch posts from database
  const posts = useQuery(api.posts.getPostsByType, {
    contentType: 'recipes'
  });

  // Create mutation to add post
  const createPost = useMutation(api.posts.createPost);

  const handleAddPost = async () => {
    await createPost({
      title: 'My Recipe',
      content: 'Recipe content here',
      contentType: 'recipes',
    });
  };

  return (
    <div>
      {posts?.map(post => (
        <div key={post._id}>{post.title}</div>
      ))}
      <button onClick={handleAddPost}>Add Post</button>
    </div>
  );
}
```

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL is not defined"
- Make sure you've run `npx convex dev`
- Check that `.env.local` has the Convex URL
- Restart your Next.js dev server after adding env vars

### "Authentication failed" or 401 errors
- Verify Clerk JWT template is created and named "convex"
- Check `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk instance
- Make sure user is signed in

### Convex dev stopped working
- Restart it: `npx convex dev`
- Check you're logged in: `npx convex login`

### Changes not syncing
- Convex dev watches the `convex/` directory
- Make sure convex dev is running
- Check terminal for errors

## Convex Dashboard

Access your Convex dashboard at: https://dashboard.convex.dev

From there you can:
- View all database tables and data
- See function logs
- Monitor performance
- Manage deployments
- Configure settings

## Security Features

### Automatic User Isolation
All queries and mutations automatically filter by `userId`:
- Users only see their own data
- No manual user ID checking needed
- Built-in security

### Authentication Required
All functions check authentication:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");
```

### Ownership Verification
Updates and deletes verify ownership:
```typescript
const post = await ctx.db.get(args.id);
if (post.userId !== identity.subject) {
  throw new Error("Not authorized");
}
```

## File Structure

```
next-app/
├── convex/
│   ├── _generated/          # Auto-generated by Convex
│   ├── auth.config.ts       # Clerk auth setup
│   ├── posts.ts             # Posts queries/mutations
│   ├── scheduledContent.ts  # Calendar queries/mutations
│   ├── presets.ts           # Preset queries/mutations
│   ├── schema.ts            # Database schema
│   └── tsconfig.json        # Convex TypeScript config
├── src/
│   ├── components/
│   │   └── ConvexClientProvider.tsx  # Convex + Clerk provider
│   └── app/
│       └── layout.tsx       # Uses ConvexClientProvider
└── .env.local               # All environment variables
```

## Resources

- **Convex Docs**: https://docs.convex.dev
- **Convex + Clerk Guide**: https://docs.convex.dev/auth/clerk
- **Convex + Next.js**: https://docs.convex.dev/quickstart/nextjs
- **Your Convex Dashboard**: https://dashboard.convex.dev

## Summary

You're almost done! Just need to:

1. ✅ Run `npx convex dev` (creates deployment & URLs)
2. ✅ Create Clerk JWT template named "convex"
3. ✅ Add `CLERK_JWT_ISSUER_DOMAIN` to `.env.local`
4. ✅ Keep convex dev running
5. ✅ Test by signing in to the app

After these steps, your app will have a fully functional real-time database with automatic authentication! 🎉
