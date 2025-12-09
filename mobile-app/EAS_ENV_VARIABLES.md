# 🔧 EAS Build Environment Variables Setup

This guide will help you configure environment variables for EAS builds to fix the TestFlight crash.

## 🚨 Problem

The app crashes immediately on launch in TestFlight because required environment variables are not configured in EAS Build.

## ✅ Solution: Set Environment Variables in EAS

### Step 1: Navigate to Mobile App Directory

```bash
cd /Users/v/Desktop-social-media-agent/mobile-app
```

### Step 2: Login to EAS (if not already logged in)

```bash
eas login
```

### Step 3: Set Required Environment Variables

Run these commands to set each required environment variable:

#### **CRITICAL - Required for App to Launch:**

```bash
# Clerk Publishable Key (REQUIRED)
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_YOUR_CLERK_KEY_HERE" --type string

# API Base URL (REQUIRED)
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "https://your-production-url.vercel.app" --type string
```

#### **Optional but Recommended:**

```bash
# Convex URL (if using Convex database)
eas secret:create --scope project --name EXPO_PUBLIC_CONVEX_URL --value "https://your-deployment.convex.cloud" --type string

# Stripe Publishable Key (if using payments)
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_YOUR_STRIPE_KEY" --type string

# OpenAI API Key (if using AI features)
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-proj-YOUR_KEY" --type string

# Sentry DSN (for error tracking)
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://YOUR_SENTRY_DSN" --type string

# Anthropic API Key (optional, if using Claude)
eas secret:create --scope project --name EXPO_PUBLIC_ANTHROPIC_API_KEY --value "sk-ant-YOUR_KEY" --type string
```

### Step 4: Verify Secrets Are Set

```bash
eas secret:list
```

You should see all the secrets you just created.

### Step 5: Rebuild Your App

After setting the secrets, rebuild your app:

```bash
eas build --platform ios --profile production
```

The environment variables will now be available during the build and the app won't crash on launch.

---

## 📋 Required Variables Checklist

- [ ] `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - **REQUIRED** - Get from Clerk dashboard
- [ ] `EXPO_PUBLIC_API_BASE_URL` - **REQUIRED** - Your production API URL
- [ ] `EXPO_PUBLIC_CONVEX_URL` - Optional - If using Convex database
- [ ] `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Optional - If using payments
- [ ] `EXPO_PUBLIC_OPENAI_API_KEY` - Optional - If using AI features
- [ ] `EXPO_PUBLIC_SENTRY_DSN` - Optional - For error tracking
- [ ] `EXPO_PUBLIC_ANTHROPIC_API_KEY` - Optional - If using Claude AI

---

## 🔍 Where to Find Your Keys

### Clerk Publishable Key
1. Go to https://dashboard.clerk.com
2. Select your app
3. Go to **API Keys**
4. Copy the **Publishable Key** (starts with `pk_live_` for production)

### API Base URL
Your production Vercel URL (e.g., `https://your-app.vercel.app`)

### Convex URL
1. Go to https://dashboard.convex.dev
2. Select your deployment
3. Copy the deployment URL (e.g., `https://xxx.convex.cloud`)

### Stripe Publishable Key
1. Go to https://dashboard.stripe.com
2. Go to **Developers** → **API keys**
3. Copy the **Publishable key** (starts with `pk_live_` for production)

---

## 🚀 Quick Start (Minimum Required)

If you just want to get the app running quickly, set these two:

```bash
cd /Users/v/Desktop-social-media-agent/mobile-app

# Set Clerk key (REQUIRED)
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "YOUR_CLERK_PUBLISHABLE_KEY" --type string

# Set API URL (REQUIRED)  
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "YOUR_PRODUCTION_API_URL" --type string

# Rebuild
eas build --platform ios --profile production
```

---

## 🔄 Update Existing Secrets

If you need to update a secret:

```bash
eas secret:delete --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "NEW_VALUE" --type string
```

---

## ❓ Troubleshooting

### App still crashes after setting secrets?

1. **Verify secrets are set:**
   ```bash
   eas secret:list
   ```

2. **Check the secret names match exactly:**
   - Must start with `EXPO_PUBLIC_`
   - Must match the variable name in your code
   - Case-sensitive

3. **Rebuild the app** (secrets are only included in new builds):
   ```bash
   eas build --platform ios --profile production --clear-cache
   ```

4. **Check build logs** for any errors:
   - Go to https://expo.dev
   - Navigate to your project
   - Check build logs

### Secrets not showing up?

- Make sure you're logged into the correct Expo account
- Verify you're in the correct project directory
- Check the scope is set to `project` (not `account`)

---

## 📝 Notes

- Secrets are only available during the **build process**
- They are embedded in the app binary (not stored in code)
- You must rebuild the app after adding/updating secrets
- All `EXPO_PUBLIC_*` variables are included in the client bundle (don't put sensitive server keys here)





