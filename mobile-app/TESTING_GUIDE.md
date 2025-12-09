# Testing Guide - Post Planner Mobile App

## Quick Start Testing

### 1. Set Up Environment Variables

Create a `.env` file in the `mobile-app` directory:

```bash
cd mobile-app
cp .env.example .env
```

Then edit `.env` with your actual API keys:

**Minimum Required:**
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from Clerk dashboard
- `EXPO_PUBLIC_OPENAI_API_KEY` - Get from OpenAI (for AI features)

**Optional but Recommended:**
- `EXPO_PUBLIC_API_BASE_URL` - Your local IP (already detected: `192.168.1.94:3000`)
- `EXPO_PUBLIC_CONVEX_URL` - If using Convex database

### 2. Start the Development Server

```bash
cd mobile-app
npm start
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Show a QR code for Expo Go

### 3. Test in Expo Go

**On Your Phone:**
1. Install **Expo Go** app from App Store (iOS) or Google Play (Android)
2. Open Expo Go
3. Scan the QR code from the terminal/browser
4. The app will load on your device

**On Simulator/Emulator:**
- **iOS (Mac only):** Press `i` in the terminal or click "Run on iOS simulator"
- **Android:** Press `a` in the terminal or click "Run on Android emulator"

### 4. Test Features

#### ✅ Authentication Flow
1. Sign up with email/password
2. Verify email (check your inbox)
3. Sign in
4. Should redirect to Dashboard

#### ✅ Dashboard Screen
- View stats (total posts, scheduled, etc.)
- Check subscription tier
- View recent activity
- Quick action buttons

#### ✅ AI Generator Screen
1. Enter a prompt (e.g., "Write about healthy eating")
2. Select content category
3. Choose platforms (multi-select)
4. Select tone
5. Toggle hashtags/image recommendations
6. Click "Generate Content"
7. View sentiment analysis and engagement score
8. Save to library

#### ✅ Content Library Screen
- Browse 13 content categories
- Search posts
- Add/edit/delete posts
- Mark as used/unused

#### ✅ Schedule Screen
- View calendar with marked dates
- Select a date to see scheduled posts
- Tap + button to schedule new post
- Use date/time pickers
- Edit/delete scheduled posts

#### ✅ Weekly Presets Screen
- Create a new preset
- Configure days (enable/disable)
- Set topic, content type, time, platforms for each day
- Save preset
- Apply preset to generate full week

#### ✅ Profile Screen
- View user info
- Check subscription status
- Open settings modal
- Configure default platforms/tone
- Export data (creates JSON file)
- Sign out

#### ✅ Pricing Screen
- View all 4 tiers
- Toggle monthly/yearly billing
- See feature comparison
- Test subscribe buttons (requires backend)

## Troubleshooting

### App Won't Load
- **Check environment variables:** Make sure `.env` file exists and has required keys
- **Check Clerk key:** Must start with `pk_test_` or `pk_live_`
- **Restart server:** Stop (Ctrl+C) and run `npm start` again

### Can't Connect to Backend
- **Check API URL:** Use your local IP, not `localhost`
- **Check backend is running:** `cd ../next-app && npm run dev`
- **Check firewall:** Port 3000 should be accessible

### AI Generation Fails
- **Check OpenAI key:** Must start with `sk-`
- **Check API quota:** Make sure you have credits
- **Check network:** Device must be on same network as dev machine

### Date/Time Pickers Not Showing
- **iOS:** Should show spinner picker
- **Android:** Should show native date/time dialogs
- **If not working:** Check that `@react-native-community/datetimepicker` is installed

### Export Not Working
- **Check permissions:** App needs file system access
- **iOS:** Should open share sheet
- **Android:** Should open share dialog

## Testing Checklist

- [ ] App loads in Expo Go
- [ ] Authentication works (sign up/in)
- [ ] Dashboard shows stats
- [ ] AI Generator creates content
- [ ] Sentiment analysis displays
- [ ] Engagement score calculates
- [ ] Content saves to library
- [ ] Calendar shows scheduled posts
- [ ] Date/time pickers work
- [ ] Can schedule new posts
- [ ] Can create weekly presets
- [ ] Can apply preset to generate week
- [ ] Profile settings save
- [ ] Data export works
- [ ] Navigation between tabs works

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Add missing API keys** for full functionality
3. **Test on both iOS and Android**
4. **Test on physical devices** (not just simulator)
5. **Configure Stripe** for subscription testing
6. **Set up backend** if not already running

## Notes

- The app works **offline** for most features (uses AsyncStorage)
- AI features require **internet connection**
- Backend API is **optional** but needed for:
  - Real subscription data
  - Stripe checkout
  - Convex sync (if using)

Happy testing! 🚀






