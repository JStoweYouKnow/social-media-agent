# Sentry Error Tracking Setup Guide

This guide will help you set up Sentry for production error tracking and monitoring.

## What's Already Configured ✅

1. ✅ Sentry SDK installed (`@sentry/nextjs`)
2. ✅ Client-side configuration (`sentry.client.config.ts`)
3. ✅ Server-side configuration (`sentry.server.config.ts`)
4. ✅ Edge runtime configuration (`sentry.edge.config.ts`)
5. ✅ Next.js config integration
6. ✅ ErrorBoundary component integrated with Sentry
7. ✅ API route error tracking integrated
8. ✅ Automatic source map upload configured

## Step 1: Create a Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account (or log in if you have one)
3. Create a new project:
   - Select **Next.js** as the platform
   - Give it a name (e.g., "post-planner")
   - Select your organization

## Step 2: Get Your Sentry DSN

After creating the project, Sentry will show you a DSN (Data Source Name). It looks like:
```
https://abc123def456@o123456.ingest.sentry.io/1234567
```

Copy this DSN - you'll need it in the next step.

## Step 3: Configure Environment Variables

### For Local Development

Add to your `.env.local` file:

```env
# Sentry Error Tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token

# Enable Sentry in development (optional, defaults to production only)
# SENTRY_ENABLE_DEV=true
# NEXT_PUBLIC_SENTRY_ENABLE_DEV=true
```

### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

**Important:** Make sure to add these for **Production**, **Preview**, and **Development** environments as needed.

## Step 4: Get Your Sentry Auth Token

1. Go to [Sentry Settings](https://sentry.io/settings/)
2. Navigate to **Auth Tokens**
3. Click **Create New Token**
4. Give it a name (e.g., "Vercel Deploy")
5. Select scopes:
   - `project:read`
   - `project:releases`
   - `org:read`
6. Click **Create Token**
7. Copy the token (you won't see it again!)

## Step 5: Verify Setup

1. **Deploy your app** (or run locally with env vars)
2. **Trigger an error** (e.g., visit a non-existent page, cause an API error)
3. **Check Sentry Dashboard** - you should see the error appear within seconds

## What Gets Tracked

### Automatic Tracking

- ✅ **React Errors** - Caught by ErrorBoundary
- ✅ **API Route Errors** - All 5xx errors automatically logged
- ✅ **Unhandled Exceptions** - Server and client-side
- ✅ **Performance Monitoring** - Page load times, API response times
- ✅ **Session Replay** - User sessions (10% sample rate)

### Manual Tracking

You can also manually track events:

```typescript
import * as Sentry from '@sentry/nextjs';

// Track an exception
Sentry.captureException(error);

// Track a message
Sentry.captureMessage('Something important happened', 'info');

// Set user context
Sentry.setUser({
  id: userId,
  email: userEmail,
});

// Add breadcrumbs
Sentry.addBreadcrumb({
  message: 'User clicked button',
  level: 'info',
});
```

## Configuration Options

### Adjust Sampling Rates

Edit `sentry.client.config.ts` and `sentry.server.config.ts`:

```typescript
tracesSampleRate: 1.0, // 100% of transactions (adjust for production)
replaysSessionSampleRate: 0.1, // 10% of sessions
replaysOnErrorSampleRate: 1.0, // 100% of error sessions
```

**Recommended for production:**
- `tracesSampleRate: 0.1` (10% of transactions)
- `replaysSessionSampleRate: 0.01` (1% of sessions)
- `replaysOnErrorSampleRate: 1.0` (100% of error sessions)

### Filter Sensitive Data

Sensitive data is automatically filtered in `sentry.server.config.ts`:
- Authorization headers
- Cookies
- API keys in query params

You can add more filters in the `beforeSend` hook.

## Testing Sentry

### Test Error Tracking

1. **Create a test error route:**

```typescript
// app/api/test-error/route.ts
import { errorResponse } from '@/lib/api-response';

export async function GET() {
  throw new Error('Test error for Sentry');
  return errorResponse('This should not be reached', 500, 'TEST_ERROR');
}
```

2. **Visit** `/api/test-error` in your browser
3. **Check Sentry** - the error should appear within seconds

### Test Error Boundary

1. **Create a test component:**

```typescript
// components/TestError.tsx
'use client';

export function TestError() {
  const throwError = () => {
    throw new Error('Test error boundary');
  };
  
  return <button onClick={throwError}>Throw Error</button>;
}
```

2. **Add to a page** and click the button
3. **Check Sentry** - error should be tracked

## Monitoring & Alerts

### Set Up Alerts

1. Go to **Alerts** in Sentry dashboard
2. Click **Create Alert Rule**
3. Configure:
   - **When:** Error count is greater than X
   - **Actions:** Email, Slack, PagerDuty, etc.

### View Performance

1. Go to **Performance** tab in Sentry
2. See:
   - Slow API routes
   - Page load times
   - Database query times
   - External API call times

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN** - Make sure it's correct in environment variables
2. **Check Environment** - Sentry is disabled in development by default
3. **Check Network** - Ensure Sentry API is accessible (not blocked by firewall)
4. **Check Console** - Look for Sentry initialization errors

### Source Maps Not Uploading

1. **Check Auth Token** - Must have `project:releases` scope
2. **Check Build Logs** - Look for Sentry upload messages
3. **Check Sentry Dashboard** - Go to **Releases** to see if source maps uploaded

### Too Many Events

1. **Reduce Sampling Rates** - Lower `tracesSampleRate` and `replaysSessionSampleRate`
2. **Add Filters** - Use `beforeSend` to filter out noise
3. **Upgrade Plan** - Free tier has limits

## Cost Considerations

Sentry's free tier includes:
- ✅ 5,000 errors/month
- ✅ 10,000 performance units/month
- ✅ 1,000 replay sessions/month
- ✅ Unlimited projects

For most small-to-medium apps, this is sufficient. Monitor your usage in the Sentry dashboard.

## Next Steps

1. ✅ Set up Sentry account
2. ✅ Add environment variables
3. ✅ Deploy and test
4. ✅ Set up alerts
5. ✅ Monitor performance
6. ✅ Configure user context (when users log in)

## Support

- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Discord](https://discord.gg/sentry)
- [Sentry Support](https://sentry.io/support/)

---

**Status:** ✅ Sentry is fully configured and ready to use once you add your DSN!

