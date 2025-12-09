# 🔧 Fix: Sign-In Not Working in TestFlight

## Problem

After signing in, the app doesn't recognize the authenticated state and doesn't navigate to the main app.

## Root Cause

The issue is likely one of these:
1. Session not persisting properly after `setActive()`
2. Navigation happening before Clerk finishes setting the active session
3. Race condition in the authentication state check

## Solution

Update the sign-in flow to properly wait for the session to be active before navigating.

### Option 1: Wait for Session to be Active (Recommended)

Update `app/(auth)/sign-in.tsx`:

```typescript
const onSignInPress = async () => {
  if (!isLoaded) return;

  setLoading(true);
  try {
    const completeSignIn = await signIn.create({
      identifier: emailAddress,
      password,
    });

    // Wait for setActive to complete
    await setActive({ session: completeSignIn.createdSessionId });
    
    // Wait a moment for Clerk to update the auth state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // The navigation will happen automatically via the useEffect in _layout.tsx
    // based on isSignedIn state change, so we don't need to manually navigate
  } catch (err: any) {
    Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign in');
  } finally {
    setLoading(false);
  }
};
```

### Option 2: Use Clerk's Built-in Components (Alternative)

Instead of custom sign-in form, use Clerk's pre-built components which handle all the edge cases automatically.

---

## Additional Checks

### 1. Verify Clerk Configuration in Clerk Dashboard

For mobile apps, you need to configure redirect URLs:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Paths** (or **Configure** → **Paths**)
4. Under **Mobile**, add:
   - **iOS Bundle ID**: `com.jamesstowe.postplanner`
   - **URL Scheme**: `postplanner://` (from your app.json scheme)

### 2. Check Environment Variables

Make sure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in EAS secrets and matches your Clerk app.

### 3. Verify SecureStore is Working

The app uses SecureStore for token caching. Make sure it's configured properly in `app.json`:

```json
{
  "plugins": [
    "expo-secure-store",
    // ... other plugins
  ]
}
```

---

## Debugging Steps

1. **Check Console Logs**
   - Add console logs to see if `setActive()` completes
   - Check if `isSignedIn` becomes `true` after sign-in

2. **Test Session Persistence**
   - After sign-in, close and reopen the app
   - Check if you're still signed in

3. **Verify Navigation Logic**
   - The `useEffect` in `_layout.tsx` should automatically navigate when `isSignedIn` changes
   - Make sure navigation isn't being blocked

---

## Quick Fix Implementation

I'll update the sign-in screen to properly handle the session activation.





