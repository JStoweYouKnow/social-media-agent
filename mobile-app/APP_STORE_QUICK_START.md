# 🚀 Quick Start: Upload to App Store

**Time required:** 2-3 hours + 1-5 days for review

---

## ⚡ Prerequisites (Do First)

### 1. Apple Developer Account
- [ ] Sign up at https://developer.apple.com/programs/
- [ ] Pay $99/year fee
- [ ] Wait for account activation (1-2 hours)

### 2. Create Test Account in Clerk
- [ ] Go to https://dashboard.clerk.com
- [ ] Create test user: `appstore-reviewer@postplanner.app`
- [ ] Password: `AppReview2025!`
- [ ] Upgrade to Pro tier (for full feature access)

---

## 🎯 Quick Commands

### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Build for App Store
```bash
cd /Users/v/Desktop-social-media-agent/mobile-app

# First time build
eas build --platform ios --profile production

# This will:
# - Generate certificates (say Yes)
# - Upload code
# - Build .ipa file (15-20 min)
```

### Submit to App Store
```bash
# After build completes
eas submit --platform ios --latest
```

---

## 📋 Before You Build - Update These Files

### 1. Update eas.json

Open `mobile-app/eas.json` and replace:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",           // ← YOUR APPLE ID EMAIL
        "ascAppId": "1234567890",                      // ← FROM APP STORE CONNECT
        "appleTeamId": "A1B2C3D4E5"                   // ← FROM DEVELOPER.APPLE.COM
      }
    }
  }
}
```

**How to get these:**

**Apple ID:** Your email used for Apple Developer account

**ascAppId:**
1. Create app in App Store Connect
2. URL will be: `appstoreconnect.apple.com/apps/1234567890/...`
3. Copy the number `1234567890`

**appleTeamId:**
1. Go to https://developer.apple.com/account
2. Scroll to "Membership Details"
3. Copy "Team ID" (looks like `A1B2C3D4E5`)

---

## 🖼️ Take Screenshots

Required before submission. Use iPhone simulator or real device:

```bash
# Start app
cd /Users/v/Desktop-social-media-agent/mobile-app
npm start

# Press 'i' for iOS simulator
# Select iPhone 14 Pro Max

# Take 5-6 screenshots:
# 1. Dashboard
# 2. Library (content categories)
# 3. Create (AI generation)
# 4. Schedule (calendar)
# 5. Presets
# 6. Profile

# Save to: mobile-app/screenshots/
```

**Screenshot Size:** 1290 x 2796 pixels (iPhone 14 Pro Max)

---

## 📱 App Store Connect Setup

### 1. Create App

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** Post Planner
   - **Language:** English
   - **Bundle ID:** com.postplanner.app
   - **SKU:** post-planner-ios-2025
4. Click "Create"
5. **SAVE THE APP ID** from URL!

### 2. Register Bundle ID (if needed)

If `com.postplanner.app` not in dropdown:

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click "+" → App IDs → App
3. Description: `Post Planner`
4. Bundle ID: `com.postplanner.app`
5. Register

---

## 📝 App Store Metadata

Copy and paste these into App Store Connect:

### App Name
```
Post Planner
```

### Subtitle (30 chars)
```
AI Social Media Planner
```

### Keywords (100 chars)
```
social media,planner,AI,content,scheduler,Instagram,Facebook,posts,marketing,creator
```

### Description
See [EAS_APP_STORE_GUIDE.md](EAS_APP_STORE_GUIDE.md) - Section "App Description"

### Support URL
```
https://postplanner.projcomfort.com
```

### Privacy Policy URL
```
https://postplanner.projcomfort.com/privacy-policy
```

### Category
- Primary: **Productivity**
- Secondary: **Business**

### Age Rating
- **4+** (answer all questions as "No")

---

## 🔐 App Review Information

### Demo Account
```
Email: appstore-reviewer@postplanner.app
Password: AppReview2025!
```

**Don't forget to create this in Clerk!**

### Contact Info
```
Name: Post Planner Support
Email: support@postplanner.app
Phone: +1 (555) 123-4567
```

### Review Notes
```
FEATURES TO TEST:
1. AI Content Generation - "Create" tab → Select category → "Generate with AI"
2. Content Library - "Library" tab → Browse categories
3. Schedule - "Schedule" tab → View calendar
4. Presets - "Presets" tab → Create templates

SERVICES USED:
- OpenAI API (AI generation)
- Anthropic Claude (AI fallback)
- Clerk (authentication)
- Stripe (subscriptions)

Test account has Pro tier access.
```

---

## ✅ Submission Checklist

Before clicking "Submit for Review":

- [ ] EAS CLI installed
- [ ] Logged into Expo account
- [ ] Apple Developer account active
- [ ] Test account created in Clerk
- [ ] eas.json updated with IDs
- [ ] App created in App Store Connect
- [ ] Screenshots taken (5-6 images)
- [ ] All metadata filled in
- [ ] Build uploaded via EAS
- [ ] Build selected in App Store Connect
- [ ] Privacy policy accessible
- [ ] Terms of service accessible

---

## 🚀 The Commands (In Order)

```bash
# 1. Install EAS
npm install -g eas-cli

# 2. Login
eas login

# 3. Go to project
cd /Users/v/Desktop-social-media-agent/mobile-app

# 4. Build
eas build --platform ios --profile production
# ⏳ Wait 15-20 minutes

# 5. Submit
eas submit --platform ios --latest
# ⏳ Wait 5-30 minutes for processing

# 6. Complete in App Store Connect
# - Upload screenshots
# - Fill metadata
# - Select build
# - Submit for review

# ⏳ Wait 1-5 days for Apple review
```

---

## ⏱️ Timeline

| Step | Time |
|------|------|
| Install & setup EAS | 10 min |
| Create app in App Store Connect | 15 min |
| Take screenshots | 30 min |
| First build with EAS | 20 min |
| Submit to App Store Connect | 10 min |
| Fill in metadata | 1 hour |
| Upload screenshots | 10 min |
| Submit for review | 5 min |
| **Apple review** | **1-5 days** |
| **TOTAL** | **~3 hours + review time** |

---

## 🆘 Common Issues

### "Bundle ID not found"
→ Register it in developer.apple.com (see above)

### "Build failed"
→ Check `eas build:list` for errors
→ Usually credential issues, regenerate with `eas credentials`

### "App Store Connect authentication failed"
→ Double-check Apple ID in eas.json
→ Use app-specific password if 2FA enabled

### "Missing compliance"
→ Answer encryption questions in App Store Connect
→ Uses HTTPS? Yes
→ Export compliance? No

---

## 🎉 After Approval

You'll receive email: "Your app is Ready for Sale"

**Your app URL:**
```
https://apps.apple.com/app/post-planner/id[APP_ID]
```

Share it everywhere! 🎊

---

## 📚 Full Documentation

For detailed step-by-step instructions, see:
- **[EAS_APP_STORE_GUIDE.md](EAS_APP_STORE_GUIDE.md)** - Complete guide with all details

---

## 🎯 Ready to Start?

1. Make sure Apple Developer account is active
2. Create test account in Clerk
3. Run the commands above
4. Follow the guide!

**Good luck!** 🚀
