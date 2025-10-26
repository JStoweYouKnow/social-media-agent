# Vercel Deployment Guide

## Current Status
Your application is ready for Vercel deployment. Key details:
- ✅ Git repository root is `/Users/v` (your home directory).
- ✅ Next.js project is located in the `Desktop-social-media-agent/next-app` subdirectory.
- ✅ All dependencies and middleware are set up.
- ✅ Latest changes pushed to GitHub

## 1. Verify GitHub

Before deploying, ensure your latest local changes are on GitHub.
Before deploying, you must verify that your local changes have been pushed to GitHub. Vercel deploys from GitHub, not your local machine.

```bash
# Check for uncommitted changes
# 1. Check for any uncommitted work.
git status

# If needed, add, commit, and push
# 2. Fetch the latest state from GitHub.
git fetch origin

# 3. See if your local branch is ahead of the remote.
# If it says "Your branch is ahead...", you need to push.
git status

# 4. (Optional) To see the exact code differences, run:
git diff origin/main

# 5. If you have changes, add, commit, and push them.
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

## 2. Configure Vercel Project Settings

### 1. Configure Root Directory in Vercel Dashboard

Since your git repository root is at `/Users/v` (your home directory), the project files are located at `Desktop-social-media-agent/next-app`.
**This is the most critical step.** If this is wrong, your changes will not be deployed.

**For your `postplanner` project in Vercel:**
1.  Go to your Vercel Project Dashboard.
2.  Navigate to **Settings** → **General**.
3.  Find the **Root Directory** setting.
4.  **Ensure it is set to exactly:** `Desktop-social-media-agent/next-app`
5.  Click **Save**.

### 2. Add Environment Variables

Go to **Settings** → **Environment Variables** and add all required variables from your local `next-app/.env.local` file.

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

#### Convex Database
Copy these from your `.env.local` file or Convex dashboard:
```
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

#### OpenAI API
Copy from your `.env.local` file or OpenAI dashboard:
```
OPENAI_API_KEY=sk-proj-...
```

#### API Base URL (leave empty or set to your domain)
```
NEXT_PUBLIC_API_BASE_URL=
```

**Important:**
- Add each variable to **Production**, **Preview**, and **Development** environments
- Click **Save** after adding all variables

### 3. Trigger New Deployment

After setting up the Root Directory and environment variables:

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**
4. Check **"Use existing Build Cache"** should be **UNCHECKED** (to ensure fresh build)
5. Click **Redeploy**
5. Click **Redeploy**.

### 4. Verify Deployment

Once the deployment completes:
1. Check the deployment URL: https://next-gcv3rdw5b-james-stowes-projects.vercel.app/
2. Verify the UI matches your local development
3. Test key features:
   - Sign in with Clerk authentication
   - View Day Planner with handwritten Caveat font
   - Check all tabs and navigation work
   - Test content generation with AI

## Common Issues

### Build fails with "Root Directory does not exist"
- Double-check the Root Directory is exactly: `Desktop-social-media-agent/next-app`
- Ensure there are no extra spaces
- Double-check the **Root Directory** is exactly `Desktop-social-media-agent/next-app` with no typos or extra spaces.

### Build fails with environment variable errors
- Verify all 11 environment variables are added
- Check for typos in variable names
- Ensure variables are added to all environments (Production, Preview, Development)
- Verify all required environment variables are added for **Production**, **Preview**, and **Development**.
- Check for typos in variable names.

### Deployment succeeds but UI doesn't match local
- Clear Vercel build cache and redeploy
- Check browser cache (hard refresh with Cmd+Shift+R on Mac)
- Verify the correct branch is deployed (main)

## Git Repository Note

Your git repository is initialized at your home directory (`/Users/v`), which is why files appear with the `Desktop-social-media-agent/` prefix in git. This is why the Root Directory setting needs to include this path.
Your git repository is initialized at your home directory (`/Users/v`). This is an unconventional setup and is the reason the **Root Directory** setting is so important.

If you want to fix this in the future, you could:
1. Create a new git repository at the project root
2. Update Vercel to use the new repository
3. Update Root Directory to just `next-app`
For a more standard setup in the future, you could re-initialize your git repository inside the `Desktop-social-media-agent` folder. If you do that, you would:
1. Create a new git repository in the correct folder.
2. Push it to a new GitHub repository.
3. Connect the new repository to Vercel.
4. Update the Vercel **Root Directory** to just `next-app`.

## Need Help?

If you encounter any issues during deployment:
1. Check the Vercel deployment logs for specific error messages
2. Verify all environment variables match your `.env.local` file
3. Ensure the latest code is pushed to GitHub
4. Try redeploying without cache

---

**Last Updated:** October 25, 2025
**Current Branch:** main
**Latest Commit:** dddb0f8a (Fix React key prop warnings)
