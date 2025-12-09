# 🔧 Troubleshooting: Sign-In Not Working in TestFlight

## Problem

After successfully signing in, the app doesn't recognize the authenticated state and doesn't navigate to the main app.

## Root Causes & Solutions

### 1. ✅ Session Not Persisting

**Problem:** The session is created but not saved to SecureStore.

**Solution:** Make sure `expo-secure-store` is properly configured in your `app.json`:

```json
{
  "plugins": [
    "expo-secure-store",
    // ... other plugins
  ]
}
```

The tokenCache in `_layout.tsx` uses SecureStore to persist tokens.

### 2. ✅ Race Condition in Navigation

**Problem:** Navigation happens before Clerk finishes updating the auth state.

**Solution:** I've updated the sign-in screen to let automatic navigation handle the redirect. The `_layout.tsx` has a `useEffect` that watches `isSignedIn` and automatically navigates when it becomes `true`.

### 3. ✅ Clerk Redirect URLs Not Configured

**Problem:** Clerk doesn't know how to redirect back to your mobile app.

**Solution:** Configure mobile redirect URLs in Clerk Dashboard:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Configure** → **Paths** (or **Settings** → **Paths**)
4. Scroll to **Mobile** section
5. Add:
   - **iOS Bundle ID**: `com.jamesstowe.postplanner`
   - **URL Scheme**: `postplanner://` (this should match your `app.json` scheme)

### 4. ✅ Wrong Clerk Publishable Key

**Problem:** Using test key instead of production key, or key doesn't match your Clerk app.

**Solution:** Verify the key in EAS secrets matches your Clerk app:

```bash
# Check current secrets
eas secret:list

# Update if needed
eas secret:delete --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_YOUR_KEY" --type string
```

### 5. ✅ Session Expiration

**Problem:** Session expires immediately or isn't valid.

**Check:** Look for errors in the console or check if `setActive()` is completing successfully.

## Testing Steps

1. **Test Sign-In Flow:**
   - Sign in with valid credentials
   - Check console for any errors
   - Wait 1-2 seconds after clicking sign in
   - Check if `isSignedIn` becomes `true`

2. **Test Session Persistence:**
   - Sign in successfully
   - Close the app completely
   - Reopen the app
   - Check if you're still signed in

3. **Debug Auth State:**
   Add console logs to `_layout.tsx`:

```typescript
useEffect(() => {
  console.log('Auth state changed:', { isLoaded, isSignedIn, segments });
  if (!isLoaded) return;

  const inAuthGroup = segments[0] === '(auth)';

  if (isSignedIn && !inAuthGroup) {
    console.log('Navigating to tabs (signed in)');
    router.replace('/(tabs)');
  } else if (!isSignedIn && !inAuthGroup) {
    console.log('Navigating to sign-in (not signed in)');
    router.replace('/(auth)/sign-in');
  }
}, [isSignedIn, segments, isLoaded]);
```

## Quick Fix Checklist

- [ ] Verify `expo-secure-store` is in `app.json` plugins
- [ ] Configure mobile redirect URLs in Clerk Dashboard
- [ ] Verify `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly in EAS secrets
- [ ] Rebuild the app after making changes: `eas build --platform ios --profile production`
- [ ] Test sign-in flow and check console logs

## Most Common Issue

**The most common issue is that Clerk redirect URLs aren't configured for mobile apps.**

Make sure in Clerk Dashboard → Configure → Paths → Mobile, you have:
- iOS Bundle ID: `com.jamesstowe.postplanner`
- URL Scheme: `postplanner://`

After configuring this, you may need to rebuild the app for it to take effect.





