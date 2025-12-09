# Why QR Code Doesn't Work & How to Fix It

## The Problem

Your app uses `expo-dev-client` because it includes:
- `@clerk/clerk-expo` (authentication)
- `@sentry/react-native` (error tracking)  
- `@stripe/stripe-react-native` (payments)
- `react-native-worklets` (reanimated)

**Expo Go cannot run apps with custom native modules**, so the QR code won't work.

## Solution: Use Development Build

### Step 1: Build the Development Build

#### For iOS:
```bash
cd mobile-app
npx expo run:ios
```

#### For Android:
```bash
cd mobile-app
npx expo run:android
```

This builds and installs the app on your device/simulator.

### Step 2: Start Dev Server

After the build is installed:

```bash
npm start
# or
npx expo start --dev-client
```

### Step 3: Connect

The app will automatically connect to the dev server. No QR code needed!

## Alternative: Remove expo-dev-client (Not Recommended)

If you want to use Expo Go with QR codes, you'd need to remove custom native modules:

```bash
npm uninstall expo-dev-client @clerk/clerk-expo @sentry/react-native @stripe/stripe-react-native
```

**Warning:** This breaks authentication, error tracking, and payments. Only use for basic UI testing.

## Quick Reference

| Method | QR Code Works? | Custom Native Modules? | Best For |
|--------|---------------|----------------------|----------|
| Expo Go | ✅ Yes | ❌ No | Simple apps, quick testing |
| Development Build | ❌ No (not needed) | ✅ Yes | Production apps, full features |

## Your App Needs Development Build

Since you're using Clerk, Sentry, and Stripe, you **must** use a development build. The QR code is not applicable here.

## Daily Workflow

1. **First time:** Build once with `npx expo run:ios` or `npx expo run:android`
2. **Every day:** Just run `npm start` - the app connects automatically
3. **No QR code needed** - the app remembers the dev server connection

## Troubleshooting

### "App won't connect to dev server"
- Make sure dev server is running: `npm start`
- Check device and computer are on same network
- Try tunnel mode: `npx expo start --tunnel`

### "Can't find development build"
- Make sure you've built and installed: `npx expo run:ios`
- Check bundle ID matches: `com.postplanner.app`






