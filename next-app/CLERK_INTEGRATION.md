# Clerk Authentication Integration

This document describes the Clerk authentication integration in the Post Planner app.

## What Was Integrated

### 1. Clerk Package Installation
- Installed `@clerk/nextjs` package
- Version compatible with Next.js 16.0.0

### 2. Environment Variables
Added to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3BlY2lhbC1ib2FyLTE3LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_w0OoWohr7d1FQ8BwjdnFuP36DsakkFRuuno2NTh0w2
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Layout Update
Updated `src/app/layout.tsx`:
- Wrapped the app with `<ClerkProvider>`
- This enables Clerk authentication across the entire app

### 4. Middleware for Route Protection
Created `src/middleware.ts`:
- Automatically protects all routes by default
- Uses Clerk's middleware to check authentication
- Redirects unauthenticated users to sign-in page

### 5. Authentication Pages
Created two authentication pages:
- **Sign In**: `src/app/sign-in/[[...sign-in]]/page.tsx`
- **Sign Up**: `src/app/sign-up/[[...sign-up]]/page.tsx`

Both pages feature:
- Custom styling matching the app's amber color scheme
- Responsive design
- Centered layout with welcome messages

### 6. User Profile in Header
Updated `src/app/page.tsx`:
- Added `<UserButton>` component in the header
- Shows user avatar and profile menu
- Includes sign-out option
- Positioned next to navigation tabs

### 7. API Route Protection
Created `src/lib/auth.ts`:
- Helper function `requireAuth()` for protecting API routes
- Returns user ID if authenticated, error response if not

Updated `src/app/api/ai/generate/route.ts` as example:
- Added authentication check at the start
- Returns 401 Unauthorized if user is not signed in

## How It Works

### User Flow
1. **Unauthenticated User**:
   - Visits the app → Automatically redirected to `/sign-in`
   - Can click "Sign Up" to create account

2. **Authentication**:
   - User signs in/up using Clerk's UI
   - Clerk handles all authentication logic
   - After success, redirected to main app (`/`)

3. **Authenticated User**:
   - Can access all app features
   - Sees their profile picture in header
   - Can click profile → Sign out

### API Protection
All API routes can be protected by adding:
```typescript
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Your API logic here...
}
```

## Testing Authentication

### To Test:
1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should be redirected to sign-in page
4. Create an account or sign in
5. After authentication, you'll see the main app
6. Your profile icon appears in the top-right header

### Sign-In Page
- URL: `http://localhost:3000/sign-in`
- Includes "Sign Up" link if user doesn't have account

### Sign-Up Page
- URL: `http://localhost:3000/sign-up`
- Includes "Sign In" link for existing users

## Clerk Dashboard

Your Clerk application is configured at:
- Dashboard: `https://dashboard.clerk.com`
- Your app domain: `special-boar-17.clerk.accounts.dev`

From the dashboard you can:
- View all users
- Customize authentication methods (email, social logins, etc.)
- Configure appearance and branding
- Set up webhooks
- View analytics

## Next Steps (Optional Enhancements)

### 1. Protect More API Routes
Add authentication to other API endpoints:
- `src/app/api/ai/generate-week/route.ts`
- `src/app/api/ai/variation/route.ts`
- `src/app/api/schedule/*`
- `src/app/api/canva/*`

### 2. User-Specific Data
Store data per user:
```typescript
const { userId } = await requireAuth();
// Save/fetch data using userId
```

### 3. Custom Authentication UI
If you want to customize further:
- Modify appearance in `SignIn`/`SignUp` components
- Add custom fields
- Configure social login providers in Clerk dashboard

### 4. Organizations/Teams
Add multi-user support:
- Enable organizations in Clerk dashboard
- Users can create teams
- Share content across team members

### 5. Webhooks
Set up webhooks to sync user data:
- User created
- User updated
- User deleted

## Security Notes

1. **Environment Variables**:
   - Never commit `.env.local` to git
   - It's already in `.gitignore`
   - In production, set these in your hosting platform

2. **Secret Key**:
   - Keep `CLERK_SECRET_KEY` private
   - Never expose it in client-side code
   - Only use in server-side code (API routes)

3. **Middleware**:
   - Automatically protects all routes
   - No need to add auth checks to every page
   - Runs before any page loads

## Build Status
✅ App builds successfully with Clerk integration
✅ No TypeScript errors
✅ All routes properly configured
✅ Sign-in and sign-up pages working

## Files Modified/Created

### Created:
- `src/middleware.ts` - Route protection middleware
- `src/lib/auth.ts` - Auth helper functions
- `src/app/sign-in/[[...sign-in]]/page.tsx` - Sign-in page
- `src/app/sign-up/[[...sign-up]]/page.tsx` - Sign-up page
- `.env.local` - Environment variables (not in git)

### Modified:
- `src/app/layout.tsx` - Added ClerkProvider
- `src/app/page.tsx` - Added UserButton in header
- `src/app/api/ai/generate/route.ts` - Added authentication
- `package.json` - Added @clerk/nextjs dependency

## Support

- Clerk Docs: https://clerk.com/docs
- Next.js Integration: https://clerk.com/docs/quickstarts/nextjs
- Support: https://clerk.com/support
