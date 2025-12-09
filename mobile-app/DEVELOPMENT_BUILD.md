# Development Build Setup Guide

Since this app uses `expo-dev-client` (required for Clerk, Sentry, Stripe, etc.), you need to build and install a development build before running the app.

## Quick Start Options

### Option 1: Build Locally (Recommended for Development)

#### For iOS (Mac only):
```bash
# 1. Install CocoaPods dependencies
cd mobile-app
npx expo prebuild

# 2. Open in Xcode and build
npx expo run:ios

# Or manually:
cd ios
pod install
cd ..
npx expo run:ios
```

#### For Android:
```bash
# 1. Generate native projects
npx expo prebuild

# 2. Build and run
npx expo run:android
```

### Option 2: Use EAS Build (Cloud Build)

```bash
# 1. Install EAS CLI (if not installed)
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure EAS (first time only)
eas build:configure

# 4. Build development build for iOS
eas build --profile development --platform ios

# 5. Build development build for Android
eas build --profile development --platform android

# 6. Install the build on your device
# iOS: Download from EAS dashboard or use TestFlight
# Android: Download APK from EAS dashboard
```

### Option 3: Use Expo Go (Limited - Not Recommended)

If you want to test without custom native code, you can temporarily remove `expo-dev-client`:

```bash
npm uninstall expo-dev-client
```

**Note:** This will break Clerk, Sentry, and Stripe integrations. Only use for basic UI testing.

## After Building

Once you have a development build installed:

1. **Start the dev server:**
   ```bash
   npm start
   # or
   npx expo start --dev-client
   ```

2. **Open the app** on your device/simulator - it will connect to the dev server automatically.

## Troubleshooting

### "No development build installed"
- Make sure you've built and installed a development build first
- Check that the bundle identifier matches: `com.postplanner.app`

### Build fails
- Make sure you have Xcode installed (for iOS)
- Make sure you have Android Studio installed (for Android)
- Run `npx expo prebuild` first to generate native projects

### App won't connect to dev server
- Make sure your device and computer are on the same network
- Check firewall settings
- Try `npx expo start --tunnel` for a tunnel connection

## Recommended Workflow

1. **First time setup:**
   ```bash
   cd mobile-app
   npx expo prebuild
   npx expo run:ios  # or run:android
   ```

2. **Daily development:**
   ```bash
   npm start
   # App will reload automatically when you make changes
   ```

3. **When adding new native dependencies:**
   ```bash
   npx expo install <package>
   npx expo prebuild
   npx expo run:ios  # rebuild
   ```






