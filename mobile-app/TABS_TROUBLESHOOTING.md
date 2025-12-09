# Tabs Not Working - Troubleshooting Guide

## Common Issues & Solutions

### 1. Check Metro Bundler Console
Look for red error messages in your terminal where `npm start` is running. Common errors:

- **Module not found** → Missing dependencies (we've been fixing these)
- **Cannot read property** → Undefined values
- **TypeError** → Runtime errors

### 2. Check Device/Simulator Console
- **iOS Simulator**: Cmd+Shift+C to open console
- **Android**: `adb logcat` or check Logcat in Android Studio
- Look for red error messages

### 3. Common Fixes

#### Fix 1: Clear Cache and Restart
```bash
# Stop the dev server (Ctrl+C)
npx expo start --clear --dev-client
```

#### Fix 2: Rebuild Development Build
Since we've added several native modules, rebuild:
```bash
npx expo run:ios
# or
npx expo run:android
```

#### Fix 3: Check for Missing Exports
All tab screens must have `export default`:
- ✅ `app/(tabs)/index.tsx` - Dashboard
- ✅ `app/(tabs)/library.tsx` - Library  
- ✅ `app/(tabs)/create.tsx` - Create
- ✅ `app/(tabs)/schedule.tsx` - Schedule
- ✅ `app/(tabs)/presets.tsx` - Presets
- ✅ `app/(tabs)/profile.tsx` - Profile

#### Fix 4: Check Authentication State
The tabs use `useUser()` from Clerk. If Clerk isn't properly initialized:
- Check `.env` has `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Restart app after login

### 4. Debug Steps

#### Step 1: Test Navigation
Try navigating programmatically:
```typescript
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/(tabs)/library');
```

#### Step 2: Add Error Boundaries
Wrap tab content in try-catch or ErrorBoundary to see errors.

#### Step 3: Check Tab Layout
The `_layout.tsx` should have all tabs defined. Verify all 6 tabs are listed.

### 5. Quick Test

Create a minimal test tab to see if navigation works:

```typescript
// app/(tabs)/test.tsx
export default function TestScreen() {
  return <Text>Test Tab Works!</Text>;
}
```

If this works, the issue is in the specific tab components.

### 6. Check These Files

- ✅ `app/_layout.tsx` - Root layout with auth routing
- ✅ `app/(tabs)/_layout.tsx` - Tab navigation config
- ✅ All tab screen files exist and export default components
- ✅ No import errors (we've been fixing these)

### 7. Most Likely Issues

Based on recent fixes:
1. **Missing native modules** - Need rebuild after installing:
   - `@react-native-community/datetimepicker`
   - `expo-sharing`
   
2. **Import errors** - Should be fixed now, but restart Metro

3. **Clerk not initialized** - Check environment variables

### 8. Next Steps

1. **Check console for specific errors** - This will tell us exactly what's wrong
2. **Try rebuilding** - `npx expo run:ios` 
3. **Clear cache** - `npx expo start --clear`
4. **Share error messages** - From Metro bundler or device console

## What "Tabs Don't Work" Could Mean

- ❌ Tabs don't appear at bottom → Check `_layout.tsx`
- ❌ Tabs appear but don't switch → Check navigation/routing
- ❌ Tabs show blank screens → Check component errors
- ❌ Tabs crash app → Check console for errors
- ❌ Can't tap tabs → Check styling/z-index issues

Please share:
1. What happens when you tap a tab? (Nothing? Error? Blank screen?)
2. Any error messages in console?
3. Do tabs appear at the bottom?






