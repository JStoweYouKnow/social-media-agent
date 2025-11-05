# Convex Database Setup Guide

This guide will help you set up Convex as your production database for subscriptions and usage tracking.

## Why Convex?

- ✅ Real-time updates
- ✅ TypeScript-first with automatic type generation
- ✅ Built-in authentication integration with Clerk
- ✅ Serverless - no infrastructure to manage
- ✅ Generous free tier
- ✅ Easy deployment

## Prerequisites

- Convex account (free at [convex.dev](https://convex.dev))
- Clerk authentication already set up (✅ you have this)

---

## Step 1: Install Convex CLI

```bash
npm install -g convex
```

Or use with npx:
```bash
npx convex
```

---

## Step 2: Initialize Convex Project

From your project root:

```bash
cd /Users/v/Desktop-social-media-agent
npx convex dev
```

This will:
1. Prompt you to log in to Convex
2. Create a new Convex project or link to existing
3. Generate the `convex/_generated` folder with types
4. Start the Convex dev server

**Follow the prompts:**
- Create new project or select existing
- Choose a project name (e.g., "post-planner")
- Confirm the convex directory location

---

## Step 3: Deploy Schema to Convex

The schema is already created at `convex/schema.ts`. Deploy it:

```bash
npx convex dev
```

This will:
- Create the tables: `subscriptions`, `usage`, `analyticsEvents`
- Set up indexes for fast queries
- Generate TypeScript types

---

## Step 4: Get Your Convex URL

After running `convex dev`, you'll see output like:

```
✓ Deployment complete
  https://your-deployment.convex.cloud
```

Copy this URL.

---

## Step 5: Update Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Also add to Vercel environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_CONVEX_URL` with your Convex URL
3. Set for Production, Preview, and Development

---

## Step 6: Update Stripe Webhook to Use Convex

Change your webhook imports from:

```typescript
// OLD (in-memory storage)
import {
  updateUserSubscription,
  getTierFromPriceId,
  getSubscriptionByCustomerId,
  getSubscriptionBySubscriptionId,
} from '@/lib/subscription';
```

To:

```typescript
// NEW (Convex database)
import {
  updateUserSubscription,
  getTierFromPriceId,
  getSubscriptionByCustomerId,
  getSubscriptionBySubscriptionId,
} from '@/lib/subscription-convex';
```

File to update: `/next-app/src/app/api/stripe/webhook/route.ts`

---

## Step 7: Test Locally

1. Start Convex dev server:
   ```bash
   npx convex dev
   ```

2. In a new terminal, start Next.js:
   ```bash
   cd next-app
   npm run dev
   ```

3. Test subscription creation:
   - Use Stripe test mode
   - Complete a test checkout
   - Check Convex dashboard to see subscription created

---

## Step 8: View Data in Convex Dashboard

1. Go to [convex.dev/dashboard](https://dashboard.convex.dev)
2. Select your project
3. Click "Data" to see your tables
4. You can view/edit records directly in the dashboard

---

## Step 9: Deploy to Production

### For Convex:

1. Deploy your Convex functions:
   ```bash
   npx convex deploy
   ```

2. Get production URL (different from dev):
   ```
   Production deployment:
   https://your-prod-deployment.convex.cloud
   ```

3. Update Vercel environment variable with production URL

### For Next.js:

```bash
git add .
git commit -m "Add Convex database for subscriptions"
git push origin main
```

Vercel will automatically deploy.

---

## Using the Convex Functions

### In API Routes

```typescript
import { getUserSubscription, trackUsage } from '@/lib/subscription-convex';

// Get user's subscription
const subscription = await getUserSubscription(userId);
console.log('User tier:', subscription.tier);

// Track AI generation
await trackUsage(userId, 'aiGenerations', 1);

// Check if user can perform action
const { allowed, message } = await canPerformAction(userId, 'aiGenerations');
if (!allowed) {
  return NextResponse.json({ error: message }, { status: 403 });
}
```

### In React Components (Client-Side)

```typescript
'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

function SubscriptionStatus() {
  const subscription = useQuery(api.subscriptions.getUserSubscription, {
    userId: user.id
  });

  if (!subscription) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Plan: {subscription.tier}</h2>
      <p>Status: {subscription.status}</p>
    </div>
  );
}
```

---

## Useful Convex Commands

```bash
# Start dev server
npx convex dev

# Deploy to production
npx convex deploy

# View logs
npx convex logs

# Open dashboard
npx convex dashboard

# Export data
npx convex export

# Import data
npx convex import
```

---

## Monitoring & Debugging

### Check Convex Logs

```bash
npx convex logs --watch
```

Or in the dashboard: **Logs** tab

### Common Issues

**"Convex not configured" error:**
- Make sure `NEXT_PUBLIC_CONVEX_URL` is set
- Restart your dev server after adding env var

**Types not found:**
- Run `npx convex dev` to regenerate types
- Check that `convex/_generated` exists

**Subscription not updating:**
- Check Convex logs for errors
- Verify Stripe webhook is calling the endpoint
- Check that you're using `subscription-convex.ts` not `subscription.ts`

---

## Migration from In-Memory to Convex

If you already have subscriptions in memory, they'll be lost on server restart. To preserve data:

1. Deploy Convex first
2. Test with new subscriptions
3. For existing users, they'll automatically get "free" tier
4. Have them re-subscribe if needed

---

## Cost

Convex free tier includes:
- 1 million function calls/month
- 1 GB data transfer
- 1 GB storage

Your app will likely stay within free tier unless you have 1000+ active users.

Paid plans start at $25/month for higher limits.

---

## Next Steps

After Convex is working:

1. ✅ Test subscription flow end-to-end
2. ✅ Verify usage tracking works
3. ✅ Check analytics events are being recorded
4. ✅ Set up production Stripe webhook
5. ✅ Deploy to Vercel production

---

## Support

- Convex Docs: https://docs.convex.dev
- Convex Discord: https://convex.dev/community
- Stripe Webhook Guide: https://stripe.com/docs/webhooks

---

**Ready to go live!** 🚀

Once Convex is set up, your subscriptions will persist across deployments and your app will be fully production-ready.
