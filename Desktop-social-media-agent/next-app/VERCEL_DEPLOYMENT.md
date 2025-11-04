# Vercel Deployment Guide

Complete guide to deploying Post Planner to Vercel with all integrations.

## Prerequisites

✅ Code pushed to GitHub (https://github.com/JStoweYouKnow/social-media-agent)
✅ Clerk account set up with keys
✅ Convex initialized (optional - can do after deployment)

## Step 1: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import from GitHub: `JStoweYouKnow/social-media-agent`
4. **Important**: Set **Root Directory** to `next-app`
5. Framework Preset: **Next.js** (should auto-detect)
6. Click **"Deploy"** (will fail first time - that's okay!)

### Option B: Via Vercel CLI

```bash
cd /Users/v/Desktop-social-media-agent/next-app
npm i -g vercel
vercel login
vercel --prod
```

## Step 2: Configure Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables**

Add these variables:

### Clerk Authentication (Required)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3BlY2lhbC1ib2FyLTE3LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_w0OoWohr7d1FQ8BwjdnFuP36DsakkFRuuno2NTh0w2
```

### Clerk URLs (Required)

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Clerk JWT for Convex (Required for Convex)

```env
CLERK_JWT_ISSUER_DOMAIN=https://special-boar-17.clerk.accounts.dev
```

### Convex Database (Optional - Initialize First)

After running `npx convex dev` locally, you'll get these values:

```env
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

**Note**: You can deploy without Convex first, then add these later.

### OpenAI API (Optional)

If you want AI generation features:

```env
OPENAI_API_KEY=sk-...your-key
```

### Canva API (Optional)

If you want Canva integration:

```env
CANVA_API_KEY=your-canva-key
CANVA_API_SECRET=your-canva-secret
```

## Step 3: Update Clerk URLs

After your first deployment, Vercel will give you a URL like:
`https://your-project.vercel.app`

### Update Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application ("special-boar-17")
3. Go to **Paths** (or **URLs**)
4. Add your Vercel URL to allowed domains:
   ```
   https://your-project.vercel.app
   ```

5. Go to **JWT Templates**
6. Select the "convex" template
7. Verify the issuer URL is correct

## Step 4: Initialize Convex (Optional)

If you want database features:

### 1. Initialize Convex Deployment

```bash
cd /Users/v/Desktop-social-media-agent/next-app
npx convex dev
```

This will:
- Create a Convex deployment
- Give you `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Sync your schema and functions

### 2. Add Convex Variables to Vercel

Copy the values from `.env.local` and add them to Vercel:

1. Go to Vercel project → Settings → Environment Variables
2. Add `CONVEX_DEPLOYMENT`
3. Add `NEXT_PUBLIC_CONVEX_URL`

### 3. Redeploy

Trigger a new deployment:
- Via Dashboard: Go to Deployments → Click "..." → Redeploy
- Via CLI: `vercel --prod`

## Step 5: Verify Deployment

### Check These URLs

1. **Homepage**: `https://your-project.vercel.app`
   - Should redirect to sign-in if not authenticated

2. **Sign In**: `https://your-project.vercel.app/sign-in`
   - Clerk sign-in page should load with your branding

3. **Sign Up**: `https://your-project.vercel.app/sign-up`
   - Clerk sign-up page should load

4. **After Auth**: Sign in and check:
   - Dashboard loads
   - Day Planner tab works
   - Calendar tab works
   - All features accessible

## Deployment Settings

### Build Configuration

Vercel should auto-detect these settings. If not, set manually:

- **Framework**: Next.js
- **Root Directory**: `next-app`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or later

### Environment

All environment variables should be set for:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development** (optional)

## Troubleshooting

### "Module not found" errors

Make sure Root Directory is set to `next-app` in Vercel project settings.

### Clerk auth not working

1. Check that all Clerk env vars are set
2. Verify Vercel URL is added to Clerk allowed domains
3. Make sure JWT issuer domain is correct

### Convex connection issues

1. Run `npx convex dev` locally first
2. Copy the exact env values to Vercel
3. Redeploy after adding Convex variables
4. Check Convex dashboard for deployment status

### Build fails

1. Check Vercel build logs
2. Ensure all dependencies are in package.json
3. Verify TypeScript has no errors locally
4. Try building locally first: `npm run build`

### API routes return 500

1. Check env variables are set correctly
2. Look at Vercel function logs
3. Ensure API keys (OpenAI, etc.) are valid

## Optional: Custom Domain

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Clerk allowed domains to include custom domain

## Security Checklist

Before going live:

- [ ] All environment variables are set in Vercel (not exposed in code)
- [ ] `.env.local` is in `.gitignore` (✅ already done)
- [ ] Clerk production keys are being used
- [ ] Convex is using production deployment
- [ ] API keys are production keys (not test keys)
- [ ] Allowed domains are configured in Clerk
- [ ] CORS settings are correct (if using external APIs)

## Post-Deployment

### Monitor

- **Vercel Dashboard**: Check function execution, logs, analytics
- **Clerk Dashboard**: Monitor user signups and authentication
- **Convex Dashboard**: Watch database queries and performance

### Updates

To deploy updates:

1. Make changes locally
2. Test thoroughly: `npm run dev`
3. Build locally: `npm run build`
4. Commit and push to GitHub: `git push origin main`
5. Vercel will auto-deploy (if enabled)

Or manually trigger:
```bash
vercel --prod
```

## Environment Variables Reference

Complete list of all possible environment variables:

```env
# Clerk (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_JWT_ISSUER_DOMAIN=https://special-boar-17.clerk.accounts.dev

# Convex (Optional - for database features)
CONVEX_DEPLOYMENT=prod:...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-...

# Canva (Optional - for design features)
CANVA_API_KEY=...
CANVA_API_SECRET=...

# Other (Optional)
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

## Success!

Your app should now be live at:
`https://your-project.vercel.app`

You can:
✅ Sign up and sign in with Clerk
✅ Use all UI features (Day Planner, Calendar, Presets)
✅ Generate AI content (if OpenAI key is set)
✅ Use Convex database (if initialized)
✅ Export calendar data
✅ Manage content across all categories

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created with `next-app` as root
- [ ] All Clerk environment variables added
- [ ] Vercel URL added to Clerk allowed domains
- [ ] Deployment successful
- [ ] Sign-in page loads correctly
- [ ] Can authenticate successfully
- [ ] Dashboard loads after auth
- [ ] (Optional) Convex initialized and env vars added
- [ ] (Optional) OpenAI key added for AI features

## Support

If issues persist:
- Check Vercel build logs
- Check browser console for errors
- Review Clerk dashboard for auth issues
- Check Convex dashboard for database issues
- Verify all environment variables are set correctly

---

**Deployment Status**: Ready to Deploy! 🚀

All code is committed and pushed. Follow steps above to deploy.
