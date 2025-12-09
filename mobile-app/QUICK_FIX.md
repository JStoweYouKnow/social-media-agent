# Quick Fix for Non-Working Buttons

## The Issue
Buttons not responding in Xcode build.

## Most Likely Cause
Clerk authentication is trying to redirect but blocking touches.

## Quick Solution (2 minutes)

### Option A: Use Expo Go (Recommended)
```bash
# Stop Xcode
# In terminal:
cd mobile-app
npx expo start --clear

# Then either:
# - Press 'i' for iOS simulator
# - OR scan QR with Expo Go app on iPhone
```

Expo Go is more stable for development than Xcode builds.

### Option B: Temporarily Disable Auth Check
Edit `app/_layout.tsx` line 65-77:

**Find this:**
```typescript
// Handle navigation based on auth state
useEffect(() => {
  if (!isLoaded) return;

  const inAuthGroup = segments[0] === '(auth)';

  if (isSignedIn && !inAuthGroup) {
    // User is signed in but not in auth group, redirect to home
    router.replace('/(tabs)');
  } else if (!isSignedIn && !inAuthGroup) {
    // User is not signed in, redirect to sign in
    router.replace('/(auth)/sign-in');
  }
}, [isSignedIn, segments, isLoaded]);
```

**Replace with:**
```typescript
// Handle navigation based on auth state
useEffect(() => {
  if (!isLoaded) return;

  // TEMPORARILY DISABLED FOR TESTING
  // const inAuthGroup = segments[0] === '(auth)';
  // if (isSignedIn && !inAuthGroup) {
  //   router.replace('/(tabs)');
  // } else if (!isSignedIn && !inAuthGroup) {
  //   router.replace('/(auth)/sign-in');
  // }
}, [isSignedIn, segments, isLoaded]);
```

Then rebuild:
```bash
npx expo start --clear
```

### Option C: Set Up Clerk Properly
1. Go to https://dashboard.clerk.com
2. Create account / sign in
3. Create new application
4. Copy the "Publishable Key"
5. Edit `.env`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```
6. Restart:
   ```bash
   npm start
   ```

## Test If It's Fixed
1. Can you tap the bottom tabs? (Dashboard, Library, Create, etc.)
2. Can you tap the + button in Library?
3. Can you tap Quick Action cards on Dashboard?

## Still Not Working?

### Nuclear Option:
```bash
# Clean EVERYTHING
rm -rf node_modules
rm -rf ios/build
rm -rf .expo
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm package-lock.json

# Reinstall
npm install

# Clear cache and start
npx expo start --clear
```

Then press `i` for iOS simulator.

## Why This Happens
- Xcode native builds can have caching issues
- Clerk auth redirects can conflict with development
- Metro bundler cache can be stale
- Reanimated plugin needs clean builds

## Best Practice for Development
**Use Expo Go app, not Xcode builds:**
1. Install "Expo Go" from App Store on your iPhone
2. Run `npm start` in terminal
3. Scan QR code with Expo Go
4. Much more stable!

Only use Xcode for:
- Testing native features
- Final production builds
- Debugging iOS-specific issues

For development, Expo Go is faster and more reliable.
