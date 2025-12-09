# 📱 Complete Guide: Upload to App Store via EAS

This guide will walk you through the entire process of building and submitting your Post Planner mobile app to the Apple App Store using Expo Application Services (EAS).

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Apple Developer Account** ($99/year)
  - Sign up at: https://developer.apple.com/programs/
  - Must be active and paid

- [ ] **App Store Connect Access**
  - Login at: https://appstoreconnect.apple.com

- [ ] **Expo Account** (free)
  - Sign up at: https://expo.dev

- [ ] **EAS CLI Installed**
  - We'll install this in Step 1

- [ ] **Git Repository**
  - Your code should be committed

- [ ] **Production Environment Configured**
  - ✅ All `.env` variables set (you have this!)
  - ✅ Custom domain configured (done!)
  - ✅ Clerk live keys (done!)
  - ✅ Stripe live keys (done!)

---

## 🎯 Current App Configuration

Your app is already configured with:

```bash
✅ App Name: Post Planner
✅ Bundle ID: com.postplanner.app
✅ Version: 1.0.0
✅ Build Number: 1
✅ Domain: https://postplanner.projcomfort.com
✅ Clerk: pk_live_Y2xlcmsucG9zdHBsYW5uZXIucHJvamNvbWZvcnQuY29tJA
✅ Stripe: pk_live_51SYa7o9rKYrAFwco...
```

---

## 🚀 Step-by-Step Guide

### Step 1: Install and Setup EAS CLI

Open Terminal and run:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

**Expected Output:** `eas-cli/X.X.X` (version number)

---

### Step 2: Login to Expo

```bash
# Login to your Expo account
eas login

# If you don't have an account, create one:
# eas register
```

**What to enter:**
- Email: Your Expo account email
- Password: Your Expo password

**Expected Output:** `Logged in as [your-email]`

---

### Step 3: Configure EAS Build

Navigate to your mobile app directory:

```bash
cd /Users/v/Desktop-social-media-agent/mobile-app
```

Initialize EAS configuration:

```bash
eas build:configure
```

**What happens:**
- Creates `eas.json` file with build profiles
- Asks which platforms to configure
- Select: **iOS** (press Enter)

**Default eas.json will be created** - we'll customize it next.

---

### Step 4: Customize eas.json

After `eas build:configure` creates the file, update it with this configuration:

**File:** `mobile-app/eas.json`

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false,
        "bundleIdentifier": "com.postplanner.app",
        "buildNumber": "1"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      }
    }
  }
}
```

**Don't worry about the submit section yet** - we'll get those IDs in later steps.

---

### Step 5: Create App in App Store Connect

1. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com
   - Sign in with your Apple Developer account

2. **Click "My Apps"**

3. **Click the "+" button** → Select "New App"

4. **Fill in the New App form:**

   **Platforms:** iOS ✓

   **Name:** `Post Planner`
   - This is the name users see on the App Store
   - 30 characters maximum

   **Primary Language:** English (U.S.)

   **Bundle ID:** Select `com.postplanner.app`
   - If not in dropdown, you need to register it first (see Step 5a below)

   **SKU:** `post-planner-ios-2025`
   - Unique identifier for your app
   - Only you see this

   **User Access:** Full Access

5. **Click "Create"**

6. **Save the App ID:**
   - After creation, you'll see a URL like:
   - `https://appstoreconnect.apple.com/apps/1234567890/appstore`
   - The number `1234567890` is your **App Store Connect App ID**
   - Save this for `eas.json` later!

---

### Step 5a: Register Bundle ID (If Needed)

If `com.postplanner.app` isn't in the Bundle ID dropdown:

1. **Go to Apple Developer Portal:**
   - https://developer.apple.com/account/resources/identifiers/list

2. **Click "+" to register a new Identifier**

3. **Select "App IDs"** → Continue

4. **Select "App"** → Continue

5. **Fill in:**
   - **Description:** `Post Planner`
   - **Bundle ID:** Explicit → `com.postplanner.app`
   - **Capabilities:** Check these:
     - ✓ Push Notifications (optional)
     - ✓ Sign in with Apple (if using)

6. **Click "Continue"** → **Register**

7. **Go back to Step 5** and create the app in App Store Connect

---

### Step 6: Get Your Apple Team ID

1. **Go to:** https://developer.apple.com/account

2. **Scroll down to "Membership Details"**

3. **Find "Team ID"** - looks like `A1B2C3D4E5`

4. **Copy it** - you'll need this for `eas.json`

---

### Step 7: Update eas.json with Real IDs

Update the `submit.production.ios` section in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "A1B2C3D4E5"
      }
    }
  }
}
```

**Replace:**
- `your-email@example.com` → Your Apple ID email
- `1234567890` → Your App Store Connect App ID (from Step 5)
- `A1B2C3D4E5` → Your Apple Team ID (from Step 6)

---

### Step 8: Prepare App Store Metadata

While EAS is building, prepare your App Store listing:

#### App Information

**Subtitle:** (30 characters max)
```
AI Social Media Planner
```

**Category:**
- Primary: **Productivity**
- Secondary: **Business**

**Content Rights:**
- Does your app contain third-party content? **No**

---

#### App Privacy

Apple requires privacy details. Based on your Privacy Policy:

**Data Types Collected:**

1. **Contact Info**
   - ✓ Email Address
   - Used for: Account creation, App functionality
   - Linked to user: Yes

2. **User Content**
   - ✓ Photos or Videos (optional - only if user adds)
   - ✓ Other User Content (social media posts)
   - Used for: App functionality
   - Linked to user: Yes

3. **Identifiers**
   - ✓ User ID
   - Used for: App functionality, Analytics
   - Linked to user: Yes

4. **Usage Data**
   - ✓ Product Interaction
   - Used for: Analytics, App functionality
   - Linked to user: Yes

**Data Not Collected:**
- Location
- Financial Info (Stripe handles payments)
- Health & Fitness
- Contacts
- Browsing History
- Precise Location

---

#### App Description (4000 characters max)

```
Transform your social media strategy with Post Planner - the ultimate AI-powered content planning and scheduling tool designed for creators, marketers, and businesses.

✨ POWERFUL AI CONTENT GENERATION
• Generate engaging posts instantly with OpenAI GPT-4 and Anthropic Claude
• Create content for any niche: recipes, fitness, real estate, tech, finance, and more
• Get AI-powered variations and improvements
• Smart hashtag generation
• SEO-optimized captions

📚 COMPREHENSIVE CONTENT LIBRARY
Organize your content across 13+ categories:
• Recipes & Cooking
• Fitness & Workouts
• Real Estate Tips
• Mindfulness & Meditation
• Travel Adventures
• Tech & Innovation
• Finance & Investing
• Beauty & Skincare
• Parenting Advice
• Business Growth
• Lifestyle Content
• Educational Posts
• Motivational Quotes

📅 SMART SCHEDULING
• Visual calendar interface
• Drag-and-drop post scheduling
• Plan weeks in advance
• Schedule for multiple platforms
• Never miss a posting opportunity

🎯 CUSTOM PRESETS
• Save reusable content templates
• Weekly content bundles
• Brand voice consistency
• Quick content creation

📊 ENGAGEMENT ANALYSIS
• Sentiment analysis for every post
• Engagement score predictions
• Content improvement recommendations
• Optimize for maximum reach

🎨 MULTI-PLATFORM SUPPORT
Create optimized content for:
• Instagram (Feed, Stories, Reels)
• Facebook
• Twitter/X
• LinkedIn
• TikTok
• Pinterest

🚀 SUBSCRIPTION TIERS

FREE TIER
• 10 AI generations per month
• 5 scheduled posts
• Access to all content categories
• Basic features

STARTER - Perfect for Individuals
• 50 AI generations per month
• 25 scheduled posts
• 3 custom categories
• 10 Canva design exports

PRO - For Professionals
• 200 AI generations per month
• 100 scheduled posts
• 10 custom categories
• 50 Canva design exports
• Priority support

AGENCY - Unlimited Everything
• Unlimited AI generations
• Unlimited scheduled posts
• Unlimited custom categories
• Unlimited Canva designs
• Dedicated support
• Team collaboration

💡 PERFECT FOR:
• Content Creators
• Social Media Managers
• Digital Marketers
• Small Business Owners
• Influencers
• Agencies
• Entrepreneurs
• Coaches & Consultants

🔒 PRIVACY & SECURITY
• Secure authentication with Clerk
• Data encryption
• GDPR compliant
• No data selling
• Full data export

🌟 WHY POST PLANNER?
• Save hours of content creation time
• Never run out of post ideas
• Consistent posting schedule
• Professional-quality content
• AI-powered insights
• All-in-one solution

TRUSTED BY THOUSANDS
Join content creators worldwide who use Post Planner to streamline their social media workflow and grow their audience.

Download Post Planner today and transform your social media presence!

---

Visit postplanner.projcomfort.com for more information.

Questions? Contact support@postplanner.app
```

---

#### Keywords (100 characters, comma-separated)

```
social media,planner,AI,content,scheduler,Instagram,Facebook,posts,marketing,creator
```

---

#### Support & Privacy URLs

**Support URL:**
```
https://postplanner.projcomfort.com
```

**Marketing URL (optional):**
```
https://postplanner.projcomfort.com
```

**Privacy Policy URL:**
```
https://postplanner.projcomfort.com/privacy-policy
```

---

### Step 9: Take Screenshots

Apple requires screenshots for different iPhone sizes. You need at least one set:

**Required Sizes:**

1. **6.7" Display (iPhone 14 Pro Max, 15 Pro Max)**
   - Resolution: 1290 x 2796 pixels
   - Required: At least 1, max 10

2. **6.5" Display (iPhone XS Max, 11 Pro Max)**
   - Resolution: 1242 x 2688 pixels
   - Optional but recommended

**How to Capture:**

**Option A: Use iPhone Simulator**
```bash
# Start the app in simulator
npm start
# Press 'i' for iOS simulator

# Select iPhone 14 Pro Max from Xcode

# Use Xcode → Debug → "Take Screenshot"
# Or press Cmd+S in simulator
```

**Option B: Use Real Device**
```bash
# Connect iPhone via USB
# Take screenshots normally
# Use Cmd+Shift+4 to capture simulator
```

**Recommended Screenshots to Capture:**

1. **Dashboard** - Shows stats and quick actions
2. **Content Library** - Categories and posts
3. **AI Generation** - Content creation in action
4. **Calendar** - Scheduled posts view
5. **Presets** - Saved templates
6. **Profile/Settings** - Subscription info

**Save screenshots to:**
```
/Users/v/Desktop-social-media-agent/mobile-app/screenshots/
```

---

### Step 10: Build for Production with EAS

Now we're ready to build!

```bash
cd /Users/v/Desktop-social-media-agent/mobile-app

# Start production build
eas build --platform ios --profile production
```

**What happens:**

1. **EAS asks for credentials:**
   - "Generate new credentials?" → **Yes** (first time)
   - EAS will generate:
     - Distribution certificate
     - Provisioning profile
     - Push notification keys

2. **Build starts on Expo servers:**
   - Your code is uploaded
   - Dependencies installed
   - iOS build compiled
   - Takes 10-20 minutes

3. **Build completes:**
   - You'll get a download link
   - Build ID shown
   - .ipa file ready

**Expected Output:**
```
✔ Build finished
✔ Standalone app: https://expo.dev/accounts/[your-account]/projects/post-planner/builds/[build-id]
```

**Save the build URL!**

---

### Step 11: Submit to App Store Connect

After the build succeeds:

```bash
# Submit the latest build to App Store
eas submit --platform ios --latest
```

**What happens:**

1. **EAS asks for confirmation:**
   - Apple ID: (should auto-fill from eas.json)
   - App Store Connect API Key: (optional, can skip)
   - Use latest build? → **Yes**

2. **Upload to App Store Connect:**
   - .ipa file uploaded
   - Processed by Apple (5-30 minutes)
   - Available in "TestFlight" section

**Expected Output:**
```
✔ Submitted to App Store Connect
✔ Build is processing on Apple servers
```

---

### Step 12: Configure Build in App Store Connect

1. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com
   - Click "My Apps" → "Post Planner"

2. **Wait for build to process:**
   - Check "TestFlight" tab
   - Build shows "Processing" → "Ready to Submit"
   - Takes 5-30 minutes

3. **Once ready, go to "App Store" tab:**
   - Click "+ Version or Platform" if needed
   - Select iOS App
   - Version: 1.0.0

4. **Scroll to "Build" section:**
   - Click "Select a build before you submit your app"
   - Select the build EAS just uploaded
   - Click "Done"

---

### Step 13: Complete App Store Listing

Fill in all required fields in App Store Connect:

#### Version Information

**What's New in This Version:**
```
Welcome to Post Planner!

🎉 Initial Release Features:
• AI-powered content generation with GPT-4 and Claude
• 13+ content categories for every niche
• Visual calendar for scheduling posts
• Custom presets and templates
• Engagement analysis and recommendations
• Multi-platform support (Instagram, Facebook, Twitter, LinkedIn, TikTok)
• 4 subscription tiers to fit your needs

Start creating amazing social media content today!
```

**Promotional Text (optional, 170 chars):**
```
Transform your social media with AI-powered content creation. Generate posts, schedule content, and grow your audience faster than ever.
```

---

#### General Information

**Copyright:**
```
2025 Post Planner
```

**Age Rating:**
Click "Edit" and answer questions:
- None of the sensitive content applies
- Age Rating: **4+**

---

#### App Review Information

**Sign-in Required:** Yes ✓

**Demo Account Credentials:**
```
Username: appstore-reviewer@postplanner.app
Password: AppReview2025!
```

**Note:** Create this test account in Clerk before submitting!

**Contact Information:**
```
First Name: Post Planner
Last Name: Support
Phone: +1 (555) 123-4567
Email: support@postplanner.app
```

**Notes:**
```
Thank you for reviewing Post Planner!

FEATURES TO TEST:
1. AI Content Generation - Tap "Create" tab, select category, tap "Generate with AI"
2. Content Library - Browse posts by category in "Library" tab
3. Post Scheduling - Tap "Schedule" tab, view calendar
4. Presets - Create reusable templates in "Presets" tab

THIRD-PARTY SERVICES:
- OpenAI API for AI content generation
- Anthropic Claude API as fallback
- Clerk for authentication
- Stripe for subscription payments (test mode for review)

The test account has Pro tier access with full features enabled.

All features work offline with local storage. AI generation requires internet connection.
```

---

#### Availability & Pricing

**Availability:**
- Countries: All available countries ✓
- Pre-order: No

**Pricing:**
- Free ✓ (app is free to download, subscriptions via in-app purchase)

---

### Step 14: Upload Screenshots

1. **In App Store Connect, scroll to "App Store Screenshots"**

2. **For iPhone 6.7" Display:**
   - Click "+" to add screenshots
   - Upload your 5-6 screenshots
   - Drag to reorder (most important first)

3. **Add App Preview (optional):**
   - Video preview (15-30 seconds)
   - Shows app in action

4. **App Icon:**
   - Should auto-populate from your app.json
   - If not, upload 1024x1024 PNG

---

### Step 15: Submit for Review

**Final Checklist:**

- [ ] All metadata filled in
- [ ] Screenshots uploaded
- [ ] Privacy policy accessible
- [ ] Test account created and working
- [ ] Build selected
- [ ] Pricing set
- [ ] Age rating complete

**Submit:**

1. Click **"Add for Review"** (top right)
2. Review summary page
3. Click **"Submit to App Review"**

**Expected Timeline:**
- Review typically takes **24-48 hours**
- Can take up to 5 business days
- You'll get email updates

---

## 📊 Build Status Tracking

### Monitor Your Build

**Check build status:**
```bash
eas build:list --platform ios
```

**View build details:**
```bash
eas build:view [BUILD_ID]
```

**Or visit:**
- https://expo.dev/accounts/[your-account]/projects/post-planner/builds

---

## 🧪 Optional: TestFlight Beta Testing

Before submitting to App Store, you can beta test:

### Setup TestFlight

1. **In App Store Connect → TestFlight tab**

2. **Add Internal Testers:**
   - Click "Internal Testing" → "+"
   - Add up to 100 testers (free)
   - Must have Apple Developer account

3. **Add External Testers (optional):**
   - Click "External Testing" → "+"
   - Add up to 10,000 testers
   - Requires basic App Review (1-2 days)

4. **Invite Testers:**
   - Enter emails
   - They receive TestFlight invitation
   - Can install and test

### Benefits:
- Find bugs before public launch
- Get user feedback
- Test on real devices
- Fix issues before App Store review

---

## 🔄 Making Updates After Submission

If you need to make changes:

### Update Code:

```bash
# 1. Make changes in your code

# 2. Increment build number in app.json:
"ios": {
  "buildNumber": "2"  // Increment from "1"
}

# 3. Build new version:
eas build --platform ios --profile production

# 4. Submit new build:
eas submit --platform ios --latest

# 5. In App Store Connect, select new build
```

---

## ❌ Common Issues & Solutions

### Issue: "Bundle ID not found"

**Solution:**
1. Register Bundle ID in Apple Developer Portal (Step 5a)
2. Wait 5 minutes
3. Try again

---

### Issue: "Build failed - Invalid provisioning profile"

**Solution:**
```bash
# Clear credentials and regenerate
eas credentials

# Select "iOS" → "Production"
# Select "Provisioning Profile"
# Select "Remove" → Rebuild
```

---

### Issue: "App Store Connect API authentication failed"

**Solution:**
- Make sure Apple ID in `eas.json` is correct
- Use App-Specific Password if 2FA enabled:
  1. Go to appleid.apple.com
  2. Generate app-specific password
  3. Use that instead of your Apple ID password

---

### Issue: "Missing compliance documentation"

**Solution:**
- In App Store Connect → select build
- Answer export compliance questions:
  - Uses encryption? **Yes** (HTTPS)
  - Export compliance? **No** (uses standard encryption)

---

## 📱 App Review Tips

### Approval Checklist:

- [ ] App doesn't crash on launch
- [ ] All features work as described
- [ ] Sign-in works with test account
- [ ] Privacy policy is accessible
- [ ] Terms of service is accessible
- [ ] No placeholder content ("Lorem ipsum")
- [ ] No broken links
- [ ] Subscriptions work (or test mode clearly marked)
- [ ] App Store description is accurate
- [ ] Screenshots show actual app (not mockups)

### Common Rejection Reasons:

❌ **App crashes** → Test thoroughly
❌ **Features don't work** → Ensure test account works
❌ **Misleading screenshots** → Use real app screenshots
❌ **Privacy policy not accessible** → ✅ You have this
❌ **Incomplete metadata** → Fill everything in
❌ **Uses private APIs** → Standard React Native is fine

---

## 🎉 After Approval

Once approved:

1. **You'll receive email: "Your app is Ready for Sale"**

2. **App appears in App Store within 24 hours**

3. **Share your app:**
   ```
   https://apps.apple.com/app/post-planner/id[YOUR_APP_ID]
   ```

4. **Monitor:**
   - Reviews and ratings
   - Download stats (App Store Connect)
   - Crash reports (App Store Connect → Crashes)

---

## 🔔 Push Notifications (Optional)

To enable push notifications later:

```bash
# Add to app.json
"ios": {
  "infoPlist": {
    "UIBackgroundModes": ["remote-notification"]
  }
}

# Configure in Expo
eas credentials
# Select iOS → Push Notifications → Generate

# Rebuild and resubmit
```

---

## 📊 Quick Command Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest

# Check build status
eas build:list

# View credentials
eas credentials

# Update app
# 1. Increment buildNumber in app.json
# 2. Build: eas build --platform ios --profile production
# 3. Submit: eas submit --platform ios --latest
```

---

## 📞 Support Resources

- **EAS Documentation:** https://docs.expo.dev/build/introduction/
- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer:** https://developer.apple.com
- **Expo Discord:** https://chat.expo.dev
- **TestFlight:** https://developer.apple.com/testflight/

---

## ✅ Final Checklist

Before you start:

- [ ] Apple Developer account active ($99/year paid)
- [ ] All code committed to git
- [ ] `.env` file configured with production keys
- [ ] Test account created in Clerk
- [ ] Screenshots prepared (5-6 images)
- [ ] App description written
- [ ] Privacy policy accessible at postplanner.projcomfort.com
- [ ] Ready to spend 2-3 hours on submission process

**Time Estimate:**
- EAS setup: 30 minutes
- Build: 15-20 minutes
- App Store Connect setup: 1-2 hours
- Review wait time: 1-5 days

---

## 🎯 Success Path

```
1. Install EAS CLI (5 min)
2. Configure eas.json (10 min)
3. Create app in App Store Connect (15 min)
4. Prepare screenshots and metadata (1 hour)
5. Build with EAS (20 min)
6. Submit to App Store Connect (10 min)
7. Complete App Store listing (30 min)
8. Submit for review (5 min)
9. Wait for approval (1-5 days)
10. App goes live! 🎉
```

---

## 🚀 You're Ready!

Your app is production-ready:
- ✅ Custom domain configured
- ✅ Live Clerk authentication
- ✅ Live Stripe payments
- ✅ Privacy policy & terms live
- ✅ All environment variables set

**Start with Step 1 and follow each step carefully.**

**Good luck with your App Store launch!** 🎊

---

**Questions?**
- support@postplanner.app
- Expo Discord: https://chat.expo.dev
