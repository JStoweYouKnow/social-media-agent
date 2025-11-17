# Quick Production Fixes

This document contains the most critical fixes to implement before production.

## 🔴 Critical Fixes

### 1. Add Rate Limiting to AI Routes

**Files to update:**
- `src/app/api/ai/generate/route.ts`
- `src/app/api/ai/generate-week/route.ts`
- `src/app/api/ai/generate-tags/route.ts`
- `src/app/api/ai/hashtags/route.ts`
- `src/app/api/ai/image-recommendations/route.ts`
- `src/app/api/ai/improve/route.ts`
- `src/app/api/ai/variation/route.ts`
- `src/app/api/parse-url/route.ts`

**Add after `requireAuth()`:**
```typescript
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Add this:
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10 // 10 requests per minute
  });
  if (rateLimitError) return rateLimitError;

  // ... rest of handler
}
```

### 2. Add Authentication to Unprotected Routes

**Files to update:**
- `src/app/api/canva/autofill/route.ts`
- `src/app/api/canva/batch/route.ts`
- `src/app/api/canva/create/route.ts`
- `src/app/api/schedule/generate-day/route.ts`
- `src/app/api/schedule/generate-week/route.ts`

**Add at the start of handler:**
```typescript
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  // ... rest of handler
}
```

### 3. Fix Linting Errors

**Main issues:**
- Unused `userId` variables (remove or use for logging)
- `any` types (replace with proper types)

**Quick fix script:**
```bash
# Fix unused variables - remove or prefix with underscore
# Change: const { userId } = await requireAuth();
# To: const { userId: _userId } = await requireAuth();

# Fix any types - replace with proper types
# Change: catch (error: any)
# To: catch (error: unknown)
```

### 4. Set Up Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Follow the prompts to configure Sentry.

### 5. Replace In-Memory Rate Limiting

**For Vercel (Recommended):**
```bash
npm install @vercel/kv
```

Update `src/lib/rate-limit.ts` to use Vercel KV instead of in-memory store.

**Or use Redis:**
```bash
npm install ioredis
```

---

## 🟡 Important Fixes

### 6. Standardize Error Responses

Create `src/lib/api-response.ts`:
```typescript
import { NextResponse } from 'next/server';

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500, code?: string) {
  return NextResponse.json(
    { error: message, ...(code && { code }) },
    { status }
  );
}
```

Then update routes to use these helpers.

### 7. Add Input Validation

Install Zod:
```bash
npm install zod
```

Create validation schemas for each route:
```typescript
import { z } from 'zod';

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  tone: z.enum(['casual', 'professional', 'funny']).optional(),
  day: z.string().optional(),
});

export async function POST(request: Request) {
  const body = GenerateRequestSchema.parse(await request.json());
  // ... rest of handler
}
```

---

## ✅ Already Fixed

- ✅ Error Boundary added to layout
- ✅ Environment variable validation exists
- ✅ Security headers configured
- ✅ SSRF protection in URL parsing

---

## Testing Checklist

After implementing fixes:

- [ ] Rate limiting works (try making 11 requests quickly)
- [ ] Unauthenticated requests to protected routes fail
- [ ] Error boundary catches React errors
- [ ] Sentry receives error reports
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

---

## Deployment Checklist

Before deploying:

- [ ] All environment variables set in Vercel
- [ ] Production keys (not test keys) configured
- [ ] Rate limiting implemented
- [ ] Error tracking configured
- [ ] All routes require authentication
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Test sign-in/sign-up flow
- [ ] Test core features

