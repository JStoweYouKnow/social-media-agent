# App Store Readiness Checklist

## Current Status: ⚠️ NOT READY FOR PRODUCTION

The app has excellent infrastructure and features, but requires several critical fixes before App Store submission.

---

## ❌ CRITICAL BLOCKERS (Must Fix)

### 1. **Authentication is Disabled**
**Status:** BLOCKING
**Issue:** Auth is bypassed for development (see `app/_layout.tsx` lines 70-81)

**What to do:**
```typescript
// In app/_layout.tsx, uncomment lines 72-76:
if (isSignedIn && !inAuthGroup) {
  router.replace('/(tabs)');
} else if (!isSignedIn && !inAuthGroup) {
  router.replace('/(auth)/sign-in');
}

// And remove lines 79-81 (the bypass)
```

**Required:**
- Set up Clerk account at https://dashboard.clerk.com
- Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env`
- Test sign-up and sign-in flows work
- Test that unauthenticated users cannot access app

### 2. **Environment Variables Not Configured**
**Status:** BLOCKING

**Required `.env` values:**
```bash
# CRITICAL - App won't work without these:
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx  # Use LIVE key for production
EXPO_PUBLIC_OPENAI_API_KEY=sk-xxxxx

# RECOMMENDED:
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # For subscriptions
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx  # For error tracking
```

**What to do:**
1. Get Clerk **LIVE** key (not test key) from dashboard
2. Get OpenAI API key
3. Get Stripe **LIVE** publishable key
4. Set up Sentry project and get DSN
5. Update `app.json` with these values in `extra` section

### 3. **App Store Assets Missing**
**Status:** BLOCKING

**Required assets:**
- [ ] App icon (1024x1024px PNG) → Save to `assets/icon.png`
- [ ] Splash screen → Update `assets/splash.png`
- [ ] App Store screenshots (6.7", 6.5", 5.5" sizes)
- [ ] App preview video (optional but recommended)

**Create these sizes:**
- iPhone 6.7" (1290 x 2796 pixels) - iPhone 14 Pro Max
- iPhone 6.5" (1242 x 2688 pixels) - iPhone XS Max
- iPhone 5.5" (1242 x 2208 pixels) - iPhone 8 Plus

### 4. **App Store Metadata Missing**
**Status:** BLOCKING

**Required information:**
- [ ] App name (30 characters max)
- [ ] App subtitle (30 characters max)
- [ ] Description (4000 characters max)
- [ ] Keywords (100 characters, comma-separated)
- [ ] Support URL
- [ ] Marketing URL
- [ ] Privacy Policy URL ⚠️ **LEGALLY REQUIRED**
- [ ] Terms of Service URL

### 5. **Privacy Policy & Terms Required**
**Status:** LEGALLY REQUIRED

**What to do:**
1. Create privacy policy (use template or lawyer)
2. Host it somewhere (e.g., `yourwebsite.com/privacy`)
3. Create terms of service
4. Host it somewhere (e.g., `yourwebsite.com/terms`)
5. Update profile screen URLs (lines 190 & 200 in `profile.tsx`)

**Current placeholders:**
```typescript
// These need to be real URLs:
const privacyUrl = 'https://post-planner.vercel.app/privacy-policy';
const termsUrl = 'https://post-planner.vercel.app/terms-of-service';
```

---

## ⚠️ HIGH PRIORITY (Should Fix)

### 6. **No Backend API Connection**
**Status:** App works offline only

**Current state:**
- AI generation uses OpenAI/Anthropic directly from mobile
- Data stored in AsyncStorage (local only)
- No cloud sync between devices
- No user data backup

**Options:**

**Option A: Use Web App Backend (Recommended)**
1. Your Next.js backend at `192.168.1.94:3000` needs to be deployed
2. Deploy to Vercel/Railway/etc.
3. Update `EXPO_PUBLIC_API_BASE_URL` to production URL
4. AI generation will use backend API (safer, no exposed API keys)

**Option B: Keep Local-Only (Not Recommended)**
- Users can only access data on one device
- No backup if they lose phone
- No collaboration features
- API keys exposed in app bundle (security risk)

### 7. **Exposed API Keys (Security Risk)**
**Status:** CRITICAL SECURITY ISSUE

**Problem:**
- OpenAI and Anthropic API keys are in the app bundle
- Anyone can extract and use your keys
- Could cost you $$$ if abused

**Solution:**
Move all AI generation to backend API:
```typescript
// Instead of calling OpenAI directly from mobile:
const result = await generateContent({ prompt, tone });

// Call your backend:
const result = await apiClient.generateContent({ prompt, tone });
// Backend handles OpenAI/Anthropic with secure keys
```

**This is already implemented in `create.tsx`!** Just needs backend deployed.

### 8. **Subscription/Payment Integration Incomplete**
**Status:** Features exist but not functional

**What works:**
- Tier limits and gating ✅
- Pricing screen UI ✅
- Usage tracking ✅

**What doesn't work:**
- Actual Stripe checkout ❌
- Subscription management portal ❌
- Payment processing ❌

**Required:**
1. Stripe backend endpoints deployed
2. Webhook configured
3. Test purchases in TestFlight
4. Set up App Store In-App Purchases (if using Apple IAP)

### 9. **Error Tracking Not Set Up**
**Status:** You'll be blind to production crashes

**What to do:**
1. Create Sentry account
2. Add `EXPO_PUBLIC_SENTRY_DSN` to `.env`
3. Initialize Sentry in `app/_layout.tsx`:

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: false,
});
```

### 10. **No Push Notifications**
**Status:** Missing key feature

**Currently:**
- Notifications toggle exists but does nothing
- No reminder system for scheduled posts
- No engagement notifications

**To implement:**
- Set up Firebase Cloud Messaging or APNs
- Create notification service
- Add scheduling logic

---

## ✅ GOOD TO HAVE (Can Launch Without)

### 11. **Analytics Not Implemented**
- [ ] Add Firebase Analytics or Amplitude
- [ ] Track user engagement
- [ ] Monitor feature usage
- [ ] A/B testing capability

### 12. **App Performance Not Optimized**
- [ ] Enable Hermes JavaScript engine
- [ ] Implement code splitting
- [ ] Add image optimization
- [ ] Profile and fix slow renders

### 13. **Accessibility Not Tested**
- [ ] VoiceOver/TalkBack support
- [ ] Color contrast for vision impairment
- [ ] Font scaling support
- [ ] Keyboard navigation

### 14. **No Onboarding Flow**
- [ ] Tutorial for first-time users
- [ ] Feature highlights
- [ ] Sample content to get started

---

## 📋 App Store Submission Checklist

### Pre-Submission

- [ ] Re-enable authentication
- [ ] Configure all environment variables
- [ ] Deploy backend API to production
- [ ] Remove all API keys from mobile app
- [ ] Set up Stripe in production mode
- [ ] Create privacy policy and terms
- [ ] Test on real iOS devices (not just simulator)
- [ ] Test on various iOS versions (15+, 16+, 17+)
- [ ] Fix all crashes and critical bugs
- [ ] Set up Sentry error tracking

### App Store Connect Setup

- [ ] Create app in App Store Connect
- [ ] Set bundle identifier: `com.postplanner.app`
- [ ] Upload app icon (1024x1024)
- [ ] Add screenshots for all required sizes
- [ ] Write app description
- [ ] Add keywords for SEO
- [ ] Set pricing (Free with in-app purchases?)
- [ ] Configure in-app purchases in App Store Connect
- [ ] Add privacy policy URL
- [ ] Add support URL
- [ ] Fill out App Privacy details (data collection disclosure)

### Build Configuration

Update `app.json`:
```json
{
  "expo": {
    "name": "Post Planner",
    "slug": "post-planner",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.postplanner.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "We need camera access to capture images for your posts.",
        "NSPhotoLibraryUsageDescription": "We need photo library access to add images to your posts.",
        "NSPhotoLibraryAddUsageDescription": "We need permission to save images to your photo library."
      }
    }
  }
}
```

### Build & Submit

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure project
eas build:configure

# 4. Build for iOS
eas build --platform ios --profile production

# 5. Submit to App Store
eas submit --platform ios
```

---

## 🧪 Testing Requirements

### Before TestFlight

- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test forgot password
- [ ] Test content generation with real API
- [ ] Test saving to library
- [ ] Test scheduling posts
- [ ] Test all profile settings
- [ ] Test export data
- [ ] Test subscription upgrade flow
- [ ] Test on slow network
- [ ] Test offline mode
- [ ] Force-kill app and reopen (state persistence)

### TestFlight Beta Testing

- [ ] Invite 10-20 beta testers
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Monitor Sentry for crashes
- [ ] Check analytics for usage patterns
- [ ] Iterate based on feedback

### App Review Preparation

- [ ] Provide test account credentials to Apple
- [ ] Document any special features
- [ ] Ensure app works on clean install
- [ ] No references to Android or "beta"
- [ ] Follows Apple Human Interface Guidelines
- [ ] No tracking without permission
- [ ] Privacy policy accessible within app

---

## 🚀 Deployment Steps (In Order)

### Week 1: Core Infrastructure
1. ✅ Set up Clerk for production
2. ✅ Deploy Next.js backend to production
3. ✅ Configure Stripe for production
4. ✅ Set up Sentry error tracking
5. ✅ Update all environment variables

### Week 2: Polish & Assets
6. ✅ Create app icon and splash screen
7. ✅ Take screenshots on real devices
8. ✅ Write privacy policy and terms
9. ✅ Create app description and metadata
10. ✅ Re-enable authentication in app

### Week 3: Testing
11. ✅ Test all features end-to-end
12. ✅ Fix critical bugs
13. ✅ Build production version
14. ✅ Internal testing on real devices

### Week 4: Submission
15. ✅ Set up App Store Connect
16. ✅ Upload build via EAS
17. ✅ Submit for review
18. ✅ Respond to any review feedback

**Realistic timeline: 4-6 weeks from today to App Store approval**

---

## 💰 Costs to Consider

- **Apple Developer Program:** $99/year (required)
- **OpenAI API:** $X/month (based on usage)
- **Stripe fees:** 2.9% + 30¢ per transaction
- **Clerk:** Free tier OK for start, $25+/month for production
- **Sentry:** Free tier OK, $26+/month for more
- **Backend hosting:** $0-20/month (Vercel free tier or Railway)
- **Domain name:** ~$12/year (for privacy policy)

**Minimum to launch:** $99 + usage-based costs

---

## Current Code Quality: ✅ EXCELLENT

**What's already great:**
- ✅ Full TypeScript implementation
- ✅ Clean architecture with separation of concerns
- ✅ Comprehensive error handling
- ✅ Professional UI/UX matching web app
- ✅ All major features implemented
- ✅ Offline-first data storage
- ✅ Sentiment analysis and engagement scoring
- ✅ Multi-platform content generation
- ✅ Proper navigation structure

**The app is well-built!** Just needs production configuration and App Store assets.

---

## Quick Actions (Next 48 Hours)

### Immediate (Today):
1. Set up Clerk production account
2. Get OpenAI API key
3. Create `.env` file with all keys
4. Re-enable authentication
5. Test sign-up flow works

### Tomorrow:
6. Deploy Next.js backend to Vercel
7. Update API URL in `.env`
8. Test AI generation through backend
9. Create app icon (use Canva or hire designer)

### This Week:
10. Write privacy policy (use template)
11. Host privacy policy somewhere
12. Take app screenshots
13. Set up Sentry
14. Join Apple Developer Program

---

## Bottom Line

**Time to production:** 4-6 weeks
**Current completion:** ~70%
**Biggest blockers:**
1. Authentication disabled
2. No backend API deployed
3. API keys exposed in app
4. Missing App Store assets

**The app is production-quality code.** It just needs production infrastructure and App Store compliance items.

**Can you build it today?** Technically yes, but it would be rejected because:
- ❌ No privacy policy
- ❌ Exposed API keys (security risk)
- ❌ Authentication bypassed
- ❌ Missing required metadata

**Recommendation:** Follow the 4-week plan above for a successful launch.
