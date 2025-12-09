# Mobile App Troubleshooting Guide

## Issue: Buttons Not Working / Touch Not Responding

### Possible Causes & Solutions

#### 1. **Gesture Handler Not Initialized**
✅ **Already Fixed** - The app already has GestureHandlerRootView properly set up in `app/_layout.tsx`

#### 2. **Running in Xcode with Stale Build**
**Solution:**
```bash
# Clean build folder
cd ios
rm -rf build
cd ..

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reinstall pods
cd ios
pod install
cd ..

# Rebuild
npm run ios
```

#### 3. **Metro Bundler Cache Issues**
**Solution:**
```bash
# Clear all caches
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install

# Start with cleared cache
npx expo start --clear
```

#### 4. **React Native Reanimated Configuration**
The app uses `react-native-reanimated`. Add to `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last!
    ],
  };
};
```

Then rebuild:
```bash
npx expo start --clear
```

#### 5. **Clerk Authentication Blocking**
If Clerk is not configured, it might block the UI. Temporarily bypass:

**Option A:** Set up Clerk properly
1. Go to https://dashboard.clerk.com
2. Get your publishable key
3. Add to `.env`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```
4. Restart: `npm start`

**Option B:** Temporarily disable auth for testing
Edit `app/_layout.tsx` and comment out the auth redirect:

```typescript
// Temporarily disable for debugging
useEffect(() => {
  if (!isLoaded) return;

  // COMMENT OUT THESE LINES:
  // const inAuthGroup = segments[0] === '(auth)';
  // if (isSignedIn && !inAuthGroup) {
  //   router.replace('/(tabs)');
  // } else if (!isSignedIn && !inAuthGroup) {
  //   router.replace('/(auth)/sign-in');
  // }
}, [isSignedIn, segments, isLoaded]);
```

#### 6. **iOS Simulator Issues**
**Solution:**
```bash
# Reset iOS simulator
xcrun simctl erase all

# Or reset just your device
xcrun simctl erase <device_id>

# Then reinstall
npm run ios
```

#### 7. **Touchable Components Import**
Verify all screens are using correct imports:
```typescript
// ✅ CORRECT
import { TouchableOpacity, Pressable } from 'react-native';

// ❌ WRONG
import TouchableOpacity from 'react-native';
```

All screens already have correct imports ✅

#### 8. **Z-Index / Overlay Issues**
Check if there's an invisible overlay blocking touches.

**Debug by adding to screen:**
```tsx
<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,0,0,0.1)', pointerEvents: 'none' }} />
```

If you see a red overlay, something is blocking touches.

#### 9. **Development vs Production Build**
Development builds can have issues. Try a production build:

```bash
# Create production build
eas build --platform ios --profile preview

# Or for local build
npx expo run:ios --configuration Release
```

#### 10. **Check Console for Errors**
In Xcode:
1. View → Debug Area → Activate Console (Cmd+Shift+Y)
2. Look for red errors
3. Common issues:
   - "Invariant Violation" → Usually component import issues
   - "Module not found" → Missing dependency
   - "Cannot read property" → Accessing undefined data

---

## Quick Diagnostic Test

Replace `app/(tabs)/index.tsx` temporarily with this simple test:

```tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function TestScreen() {
  const handlePress = () => {
    Alert.alert('Success!', 'Button is working!');
    console.log('Button pressed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Touch Test</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'blue' }]}
        onPress={() => console.log('Blue button pressed')}
      >
        <Text style={styles.buttonText}>Test Button 2</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F3EE',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#C4A484',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

**If this test works:** The issue is in your specific screen code
**If this doesn't work:** The issue is with the build/environment

---

## Most Likely Solution (Try These First)

### Solution 1: Clear Everything and Rebuild
```bash
# Stop all running processes
# Then:
rm -rf node_modules
rm -rf ios/build
rm -rf .expo
rm package-lock.json

npm install
cd ios && pod install && cd ..

npx expo start --clear
# Then press 'i' for iOS
```

### Solution 2: Check Babel Config
Ensure `babel.config.js` is:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

### Solution 3: Use Expo Go Instead of Xcode
Sometimes native builds have issues. Try Expo Go:
```bash
npm start
# Scan QR code in Expo Go app
```

Expo Go is more stable for development.

---

## Environment Issues

### Check Node Version
```bash
node --version  # Should be 18+ or 20+
```

If wrong version:
```bash
nvm install 20
nvm use 20
```

### Check React Native Setup
```bash
npx react-native doctor
```

This will diagnose common issues.

---

## Still Not Working?

### Nuclear Option - Recreate iOS Build
```bash
# Delete ios folder
rm -rf ios

# Recreate with prebuild
npx expo prebuild --platform ios --clean

# Install pods
cd ios && pod install && cd ..

# Run
npm run ios
```

### Last Resort - Check App.json Plugins
Ensure `app.json` has:
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ],
      "expo-secure-store"
    ]
  }
}
```

---

## Enable Debug Mode

### React DevTools
```bash
npm install -g react-devtools
react-devtools
```

Then in app, shake device and enable "Debug Remote JS"

### Enable Touch Visualization
In Xcode simulator:
- Debug → Toggle Slow Animations
- Debug → Show Touches

This will show if touches are being registered.

---

## Common Xcode Errors

### "Could not find iPhone X simulator"
**Solution:** Open Xcode → Window → Devices and Simulators → Create new simulator

### "Unable to boot device"
**Solution:**
```bash
xcrun simctl shutdown all
xcrun simctl boot "iPhone 15"
```

### "Build Failed - React/RCTBridgeModule.h not found"
**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

---

## Report Back

After trying these solutions, check:

1. **Can you tap the tab bar icons?** (Switch between Dashboard, Library, Create, etc.)
2. **Can you tap the FAB (+) button in Library tab?**
3. **Do you see any red error boxes?**
4. **What does the console say in Xcode?**

If buttons still don't work after trying solution 1 (clear everything), the issue is likely:
- Clerk authentication blocking (solution: disable temporarily)
- iOS simulator issue (solution: try Expo Go app instead)
- Xcode configuration issue (solution: try `npx expo start` and use Expo Go)

**Recommended immediate action:**
1. Stop Xcode
2. Run `npm start` in terminal
3. Open Expo Go app on your physical iPhone
4. Scan QR code
5. Test if buttons work there

Expo Go is more reliable for development than Xcode builds.
