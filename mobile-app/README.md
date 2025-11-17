# Post Planner Mobile App

Native mobile application for Post Planner, built with React Native and Expo.

## Features

- 📱 Native iOS and Android app
- 🔐 Clerk authentication with email/password
- 🤖 AI content generation
- 📅 Content scheduling and calendar view
- 👤 User profile and subscription management
- 🔄 Real-time sync with Convex database
- 💳 Stripe subscription integration

## Tech Stack

- **React Native 0.76.6** - Native mobile framework
- **Expo ~52.0.17** - Development and build tooling
- **Expo Router ~4.0.14** - File-based routing (like Next.js)
- **Clerk Expo ^2.4.2** - Authentication
- **Convex ^1.28.2** - Real-time database
- **TypeScript ~5.6.2** - Type safety
- **date-fns ^4.1.0** - Date utilities

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio
- Expo Go app on your physical device (optional)

## Installation

1. **Navigate to mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with your values:**
   ```env
   # Clerk Authentication
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

   # Convex Database
   EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

   # API Base URL (use local IP for dev, not localhost)
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000
   ```

   **Important:** For local development, replace `192.168.1.100` with your computer's local IP address:
   - **Mac/Linux:** Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows:** Run `ipconfig` and look for "IPv4 Address"

## Development

### Start the development server:

```bash
npm start
```

This opens the Expo DevTools in your browser.

### Run on iOS Simulator (Mac only):

```bash
npm run ios
```

### Run on Android Emulator:

```bash
npm run android
```

### Run on physical device:

1. Install "Expo Go" app from App Store or Google Play
2. Scan the QR code shown in the terminal/DevTools
3. The app will load on your device

## Project Structure

```
mobile-app/
├── app/                        # Expo Router file-based routing
│   ├── (auth)/                # Authentication screens
│   │   ├── _layout.tsx        # Auth stack navigation
│   │   ├── sign-in.tsx        # Sign in screen
│   │   └── sign-up.tsx        # Sign up screen
│   ├── (tabs)/                # Main app tabs
│   │   ├── _layout.tsx        # Tab navigation
│   │   ├── index.tsx          # Home/Dashboard
│   │   ├── create.tsx         # Content creation
│   │   ├── schedule.tsx       # Schedule view
│   │   └── profile.tsx        # User profile
│   └── _layout.tsx            # Root layout with providers
├── components/                 # Reusable UI components
│   ├── ContentCard.tsx        # Content item display
│   ├── EmptyState.tsx         # Empty state placeholder
│   ├── LoadingSpinner.tsx     # Loading indicator
│   └── PremiumFeature.tsx     # Premium feature wrapper
├── lib/                       # Utilities and clients
│   ├── api-client.ts          # API client for Next.js backend
│   └── convex-client.ts       # Convex database client
├── assets/                    # Images, fonts, etc.
└── shared/                    # Shared code with web app
    └── lib/
        ├── subscription-types.ts  # Subscription utilities
        └── content-types.ts       # Content types
```

## Routing

This app uses **Expo Router**, which provides file-based routing similar to Next.js:

- `app/_layout.tsx` - Root layout with Clerk and Convex providers
- `app/(auth)/*` - Authentication flow (sign-in, sign-up)
- `app/(tabs)/*` - Main app with bottom tab navigation
- Automatic navigation based on auth state

## Authentication

The app uses **Clerk** for authentication:

1. Sign up with email/password
2. Email verification required
3. Automatic redirect to app after sign-in
4. Token stored securely with expo-secure-store
5. Shared authentication with web app

## API Integration

The mobile app connects to the same Next.js backend as the web app:

- All API calls go through `apiClient` in `lib/api-client.ts`
- Authenticated requests include Clerk JWT token
- Same endpoints as web app (`/api/ai/generate`, `/api/stripe/checkout`, etc.)

## Database

Uses **Convex** for real-time database access:

- Shared database with web app
- Real-time subscriptions and usage tracking
- Automatic syncing across devices

## Building for Production

### iOS (requires Mac and Apple Developer account):

```bash
npm run build:ios
```

### Android:

```bash
npm run build:android
```

## Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `EXPO_PUBLIC_CONVEX_URL` - Convex deployment URL
- `EXPO_PUBLIC_API_BASE_URL` - Next.js backend URL

## Troubleshooting

### Cannot connect to backend:

- Ensure you're using your local IP address, not `localhost`
- Check that your backend is running (`cd next-app && npm run dev`)
- Verify firewall isn't blocking port 3000

### Build errors:

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Authentication issues:

- Verify Clerk publishable key in `.env`
- Check that Clerk dashboard has correct redirect URLs
- Ensure you're using the same Clerk instance as web app

## Next Steps

1. **Configure Clerk:**
   - Add mobile redirect URLs in Clerk dashboard
   - Test sign-up and sign-in flows

2. **Test API Integration:**
   - Start Next.js backend
   - Test content generation
   - Verify subscription data loads

3. **Build and Deploy:**
   - Set up EAS Build project
   - Configure app.json with bundle identifiers
   - Submit to App Store / Google Play

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Clerk Expo SDK](https://clerk.com/docs/references/expo/overview)
- [Convex React Native](https://docs.convex.dev/client/react)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

## Support

For issues or questions:
- Check the main project README
- Review Expo and Clerk documentation
- Open an issue in the repository
