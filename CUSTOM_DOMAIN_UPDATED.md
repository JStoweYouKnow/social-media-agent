# ✅ Custom Domain Updated - postplanner.projcomfort.com

## Summary

All references to the Vercel domain have been updated to use your custom domain!

**Old Domain:** `https://next-na7kpgnic-james-stowes-projects.vercel.app`
**New Domain:** `https://postplanner.projcomfort.com`

---

## ✅ Files Updated

### Mobile App Configuration

#### 1. [mobile-app/.env](mobile-app/.env)
**Changed:** API Base URL
```bash
# Before:
EXPO_PUBLIC_API_BASE_URL=https://next-na7kpgnic-james-stowes-projects.vercel.app

# After:
EXPO_PUBLIC_API_BASE_URL=https://postplanner.projcomfort.com
```
**Impact:** All API calls from mobile app now use custom domain

---

#### 2. [mobile-app/app/(tabs)/profile.tsx](mobile-app/app/(tabs)/profile.tsx)
**Changed:** Privacy Policy and Terms of Service URLs (lines 206, 217)
```typescript
// Before:
const privacyUrl = 'https://next-na7kpgnic-james-stowes-projects.vercel.app/privacy-policy';
const termsUrl = 'https://next-na7kpgnic-james-stowes-projects.vercel.app/terms-of-service';

// After:
const privacyUrl = 'https://postplanner.projcomfort.com/privacy-policy';
const termsUrl = 'https://postplanner.projcomfort.com/terms-of-service';
```
**Impact:** Privacy/Terms links in Profile tab now open custom domain

---

### Next.js Backend Configuration

#### 3. [next-app/src/app/layout.tsx](next-app/src/app/layout.tsx)
**Changed:** Metadata base URLs (lines 35, 64)
```typescript
// Before:
metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app')
url: process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app'

// After:
metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://postplanner.projcomfort.com')
url: process.env.NEXT_PUBLIC_APP_URL || 'https://postplanner.projcomfort.com'
```
**Impact:** SEO metadata and Open Graph tags use custom domain

---

#### 4. [next-app/src/app/sitemap.ts](next-app/src/app/sitemap.ts)
**Changed:** Base URL for sitemap (line 4)
```typescript
// Before:
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app';

// After:
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://postplanner.projcomfort.com';
```
**Impact:** XML sitemap now uses custom domain for all URLs

---

#### 5. [next-app/src/app/robots.ts](next-app/src/app/robots.ts)
**Changed:** Base URL for robots.txt (line 4)
```typescript
// Before:
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app';

// After:
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://postplanner.projcomfort.com';
```
**Impact:** robots.txt sitemap reference uses custom domain

---

#### 6. [next-app/next.config.ts](next-app/next.config.ts)
**Changed:** Environment variable default (line 85)
```typescript
// Before:
NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app'

// After:
NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://postplanner.projcomfort.com'
```
**Impact:** Default app URL in Next.js config uses custom domain

---

#### 7. [next-app/src/app/privacy-policy/page.tsx](next-app/src/app/privacy-policy/page.tsx)
**Changed:** Website contact URL (line 218)
```tsx
// Before:
<strong>Website:</strong> https://post-planner.vercel.app

// After:
<strong>Website:</strong> https://postplanner.projcomfort.com
```
**Impact:** Privacy policy shows custom domain

---

#### 8. [next-app/src/app/terms-of-service/page.tsx](next-app/src/app/terms-of-service/page.tsx)
**Changed:** Website contact URL (line 332)
```tsx
// Before:
<strong>Website:</strong> https://post-planner.vercel.app

// After:
<strong>Website:</strong> https://postplanner.projcomfort.com
```
**Impact:** Terms of service shows custom domain

---

#### 9. [README.md](README.md)
**Changed:** Production URL (line 7)
```markdown
# Before:
**Production URL**: https://next-na7kpgnic-james-stowes-projects.vercel.app

# After:
**Production URL**: https://postplanner.projcomfort.com
```
**Impact:** Documentation reflects custom domain

---

## 🎯 What This Means

### For Users:
- ✅ Cleaner, professional domain name
- ✅ Easier to remember: `postplanner.projcomfort.com`
- ✅ Consistent branding across web and mobile
- ✅ All links point to custom domain

### For SEO:
- ✅ Custom domain improves search rankings
- ✅ Sitemap uses custom domain
- ✅ Open Graph tags show custom domain
- ✅ robots.txt references custom domain

### For Mobile App:
- ✅ API calls use custom domain
- ✅ Privacy/Terms pages use custom domain
- ✅ Professional URLs in App Store listing

---

## 📱 Mobile App URLs

All mobile app URLs now point to custom domain:

| Feature | URL |
|---------|-----|
| **API Base** | `https://postplanner.projcomfort.com` |
| **Privacy Policy** | `https://postplanner.projcomfort.com/privacy-policy` |
| **Terms of Service** | `https://postplanner.projcomfort.com/terms-of-service` |

---

## 🌐 Next.js App URLs

All backend URLs now use custom domain:

| Page | URL |
|------|-----|
| **Homepage** | `https://postplanner.projcomfort.com` |
| **Sign In** | `https://postplanner.projcomfort.com/sign-in` |
| **Sign Up** | `https://postplanner.projcomfort.com/sign-up` |
| **Pricing** | `https://postplanner.projcomfort.com/pricing` |
| **Privacy** | `https://postplanner.projcomfort.com/privacy-policy` |
| **Terms** | `https://postplanner.projcomfort.com/terms-of-service` |

---

## ⚙️ Environment Variables

### Mobile App (.env)
```bash
✅ EXPO_PUBLIC_API_BASE_URL=https://postplanner.projcomfort.com
✅ EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (live mode)
✅ EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (live mode)
```

### Next.js App (.env.local) - Optional
You can optionally add to force the custom domain:
```bash
NEXT_PUBLIC_APP_URL=https://postplanner.projcomfort.com
```

**Note:** Not required since we updated all fallback values in the code!

---

## 🔄 DNS Configuration

Your custom domain should be configured in Vercel:

1. **Vercel Dashboard** → Your Project → Settings → Domains
2. Add domain: `postplanner.projcomfort.com`
3. Configure DNS records:
   - Type: `CNAME`
   - Name: `postplanner`
   - Value: `cname.vercel-dns.com`

**Status:** ✅ Already configured (since the domain is working)

---

## 🧪 Testing the Custom Domain

### Test Backend (Web):
1. Visit: https://postplanner.projcomfort.com
2. Should load the Next.js app
3. Test sign in/sign up
4. Check Privacy: https://postplanner.projcomfort.com/privacy-policy
5. Check Terms: https://postplanner.projcomfort.com/terms-of-service

### Test Mobile App:
1. Restart the app: `npx expo start --clear`
2. Test AI generation (calls API)
3. Open Profile → tap Privacy Policy
4. Open Profile → tap Terms of Service
5. All should open custom domain

---

## 📋 App Store Listing

Update your App Store metadata to use custom domain:

### Support & Marketing URLs:
```
Support URL: https://postplanner.projcomfort.com/support
Marketing URL: https://postplanner.projcomfort.com
Privacy Policy: https://postplanner.projcomfort.com/privacy-policy
```

### App Description:
Reference the custom domain in your app description:
```
"Visit postplanner.projcomfort.com to learn more"
```

---

## ✅ Checklist

- [x] Mobile app API base URL updated
- [x] Mobile app Privacy/Terms URLs updated
- [x] Next.js metadata URLs updated
- [x] Sitemap URL updated
- [x] robots.txt URL updated
- [x] Privacy policy URL updated
- [x] Terms of service URL updated
- [x] README updated
- [x] Next.js config updated

**Status:** ✅ **All URLs Updated to Custom Domain**

---

## 🚀 Next Steps

1. **Test thoroughly:**
   ```bash
   # Restart mobile app
   cd mobile-app
   npx expo start --clear
   ```

2. **Verify all URLs work:**
   - API calls succeed
   - Privacy/Terms pages load
   - No broken links

3. **Ready for App Store:**
   - All URLs are production-ready
   - Custom domain looks professional
   - Legal pages accessible

---

## 📞 Support

If you need to update the domain again in the future, search for:
```bash
# In the codebase:
grep -r "postplanner.projcomfort.com" .

# Or search for the fallback pattern:
grep -r "NEXT_PUBLIC_APP_URL ||" .
```

---

## 🎉 Summary

Your app now uses the custom domain **`postplanner.projcomfort.com`** everywhere!

| Component | Status | Domain |
|-----------|--------|--------|
| Mobile API | ✅ Updated | postplanner.projcomfort.com |
| Privacy Policy | ✅ Updated | postplanner.projcomfort.com |
| Terms of Service | ✅ Updated | postplanner.projcomfort.com |
| SEO Metadata | ✅ Updated | postplanner.projcomfort.com |
| Sitemap | ✅ Updated | postplanner.projcomfort.com |
| README | ✅ Updated | postplanner.projcomfort.com |

**Your custom domain is fully integrated!** 🎊
