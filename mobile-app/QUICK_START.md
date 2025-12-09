# Quick Start - Development Build

## ✅ Step 1: Native Projects Generated
The iOS native project has been created. You're ready to build!

## 🚀 Step 2: Build and Run

### Option A: Build and Run Automatically (Recommended)
```bash
cd mobile-app
npx expo run:ios
```

This will:
- Build the iOS app
- Install it on the iOS Simulator (or connected device)
- Start the Metro bundler
- Launch the app

### Option B: Build Only
```bash
npx expo run:ios --no-install
```

Then manually open the app from the simulator.

## 📱 Step 3: Start Development Server

After the build is installed, start the dev server:

```bash
npm start
# or
npx expo start --dev-client
```

The app will automatically connect to the dev server and reload when you make changes.

## 🔄 Daily Development Workflow

Once you have the development build installed:

1. **Start the dev server:**
   ```bash
   npm start
   ```

2. **Open the app** on your device/simulator - it will connect automatically

3. **Make changes** - the app will hot reload

## 🛠️ Troubleshooting

### Build fails
- Make sure Xcode is fully installed and updated
- Try: `cd ios && pod install && cd ..`
- Then: `npx expo run:ios`

### App won't connect
- Make sure dev server is running: `npm start`
- Check that device and computer are on same network
- Try tunnel mode: `npx expo start --tunnel`

### Need to rebuild after dependency changes
```bash
npx expo prebuild --clean
npx expo run:ios
```

## 📝 Next Steps

1. Run `npx expo run:ios` to build and install
2. Once installed, use `npm start` for daily development
3. The app will hot reload automatically!






