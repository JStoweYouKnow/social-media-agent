# Post Planner Mobile App - Complete Implementation Guide

## 🎯 Project Overview

This is a **complete React Native mobile replication** of your Post Planner web app, providing a 1:1 mobile experience with all features optimized for iOS and Android.

### What's Been Built ✅

1. **Project Foundation**
   - ✅ Expo 52 project with TypeScript
   - ✅ All dependencies installed (OpenAI, Anthropic, Clerk, Stripe, Sentry, etc.)
   - ✅ File-based routing with Expo Router
   - ✅ Authentication flow with Clerk

2. **Core Infrastructure**
   - ✅ Complete TypeScript type definitions (`lib/types.ts`)
   - ✅ Subscription tier system (`lib/subscription-types.ts`)
   - ✅ AI service layer with OpenAI & Anthropic (`lib/ai-service.ts`)
   - ✅ Local storage service with AsyncStorage (`lib/storage.ts`)
   - ✅ Sentiment analysis & engagement scoring (`lib/sentiment-analysis.ts`)

3. **Screens & Navigation**
   - ✅ Tab navigation with 5 tabs (Dashboard, Library, Create, Schedule, Profile)
   - ✅ **Content Library screen - FULLY FUNCTIONAL** (`app/(tabs)/library.tsx`)
     - Browse 13 content categories
     - Add/edit/delete posts
     - Mark as used/unused
     - Search functionality
     - Category tabs with icons

4. **UI/UX**
   - ✅ Professional design matching web app colors (cream #F6F3EE, accent #C4A484)
   - ✅ Responsive layouts
   - ✅ Loading states and empty views

---

## 📋 What Needs to Be Built

### Priority 1: Core Screens (Essential)

#### 1. AI Generator Screen (`app/(tabs)/create.tsx`)
**Status:** Skeleton exists, needs full implementation

**Required UI Components:**
```tsx
- Prompt text input (multiline)
- Tone selector: professional, casual, funny, inspiring, educational
- Platform multi-select: Instagram, Facebook, LinkedIn, Twitter
- Content type picker: all 13 categories
- "Include Hashtags" switch
- "Include Image Recommendations" switch
- Generate button (with loading spinner)
- Results card showing:
  - Generated content
  - Sentiment score (positive/negative/neutral)
  - Engagement score (0-100)
  - Recommendations list
  - Save to library button
```

**Implementation Example:**
```typescript
import { generateContent } from '@/lib/ai-service';
import { analyzeSentiment, calculateEngagementScore } from '@/lib/sentiment-analysis';
import { savePost } from '@/lib/storage';

const [prompt, setPrompt] = useState('');
const [tone, setTone] = useState('professional');
const [platforms, setPlatforms] = useState(['instagram']);
const [category, setCategory] = useState<ContentType>('lifestyle');
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);

const handleGenerate = async () => {
  setLoading(true);
  try {
    const generated = await generateContent({
      prompt,
      tone,
      platforms,
      contentType: category,
      includeHashtags: true,
      includeImageRecommendations: true,
    });

    const sentiment = analyzeSentiment(generated.content);
    const engagement = calculateEngagementScore(generated.content);

    setResult({ ...generated, sentiment, engagement });
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};

const handleSave = async () => {
  await savePost(category, {
    id: Date.now().toString(),
    title: prompt.substring(0, 50),
    content: result.content,
    tags: result.hashtags || '',
    createdAt: new Date().toISOString(),
    sentiment: result.sentiment,
    engagementScore: result.engagement.score,
    imageRecommendations: result.imageRecommendations,
  });
  Alert.alert('Success', 'Saved to library!');
};
```

#### 2. Calendar/Schedule Screen (`app/(tabs)/schedule.tsx`)
**Status:** Skeleton exists, needs full implementation

**Required Packages:** `react-native-calendars` (already installed)

**Required UI Components:**
```tsx
- Calendar view with marked dates
- List of scheduled posts below calendar
- Add post FAB button
- Modal for scheduling:
  - Content text input
  - Date picker
  - Time picker
  - Platform multi-select
  - Save button
- Edit/delete scheduled posts
```

**Implementation Example:**
```typescript
import { Calendar } from 'react-native-calendars';
import { getScheduledContent, saveScheduledContent, deleteScheduledContent } from '@/lib/storage';

const [selectedDate, setSelectedDate] = useState('');
const [scheduled, setScheduled] = useState<ScheduledContent[]>([]);
const [markedDates, setMarkedDates] = useState({});

useEffect(() => {
  loadScheduledContent();
}, []);

const loadScheduledContent = async () => {
  const content = await getScheduledContent();
  setScheduled(content);

  // Mark dates on calendar
  const marked = {};
  content.forEach(item => {
    marked[item.date] = { marked: true, dotColor: '#C4A484' };
  });
  setMarkedDates(marked);
};

const handleSchedule = async (content, date, time, platforms) => {
  const newScheduled: ScheduledContent = {
    id: Date.now().toString(),
    title: content.substring(0, 50),
    content,
    date,
    time,
    platform: platforms,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };

  await saveScheduledContent(newScheduled);
  await loadScheduledContent();
};
```

#### 3. Enhanced Dashboard (`app/(tabs)/index.tsx`)
**Status:** Basic version exists, needs enhancement

**Add to existing dashboard:**
```typescript
import { getAllPosts, getScheduledContent } from '@/lib/storage';
import { calculateEngagementScore } from '@/lib/sentiment-analysis';

const [stats, setStats] = useState({
  totalPosts: 0,
  scheduledPosts: 0,
  avgEngagement: 0,
  categoriesUsed: 0,
  thisWeekScheduled: 0,
});

const calculateStats = async () => {
  const allPosts = await getAllPosts();
  const scheduled = await getScheduledContent();

  const totalPosts = Object.values(allPosts).reduce(
    (sum, posts) => sum + posts.length,
    0
  );

  const categoriesUsed = Object.keys(allPosts).length;

  // Calculate average engagement
  const postsWithEngagement = Object.values(allPosts)
    .flat()
    .filter(p => p.engagementScore);
  const avgEngagement = postsWithEngagement.length > 0
    ? postsWithEngagement.reduce((sum, p) => sum + (p.engagementScore || 0), 0) / postsWithEngagement.length
    : 0;

  // This week's scheduled posts
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thisWeekScheduled = scheduled.filter(
    s => new Date(s.date) >= now && new Date(s.date) <= oneWeekFromNow
  ).length;

  setStats({
    totalPosts,
    scheduledPosts: scheduled.length,
    avgEngagement: Math.round(avgEngagement),
    categoriesUsed,
    thisWeekScheduled,
  });
};
```

#### 4. Profile/Settings Screen (`app/(tabs)/profile.tsx`)
**Status:** Basic version exists, needs enhancement

**Add these sections:**
```tsx
- User info (from Clerk)
- Current subscription tier
- Usage stats (AI generations used this month)
- Upgrade button → link to pricing screen
- Settings:
  - Default platforms
  - Default tone
  - Notifications toggle
- Export data button
- Sign out button
```

**Implementation:**
```typescript
import { useUser, useClerk } from '@clerk/clerk-expo';
import { getTierLimits, getTierDisplayName } from '@/lib/subscription-types';
import { exportData } from '@/lib/storage';
import * as Sharing from 'expo-sharing';

const { user } = useUser();
const { signOut } = useClerk();

const tier = 'free'; // TODO: Get from backend
const limits = getTierLimits(tier);

const handleExport = async () => {
  const data = await exportData();
  // Save to file and share
  const fileUri = FileSystem.cacheDirectory + 'post-planner-export.json';
  await FileSystem.writeAsStringAsync(fileUri, data);
  await Sharing.shareAsync(fileUri);
};

const handleSignOut = async () => {
  await signOut();
};
```

---

### Priority 2: Additional Features

#### 5. Pricing/Subscription Screen
**New file:** `app/pricing.tsx`

**What to build:**
- Display all 4 tiers (Free, Starter, Pro, Agency)
- Pricing cards with monthly/yearly toggle
- Feature comparison list
- Subscribe buttons → Stripe checkout
- Current plan indicator

**Use:** `lib/subscription-types.ts` for all tier data

#### 6. Weekly Presets Manager
**Could be:** New tab or part of schedule screen

**What to build:**
- List saved presets
- Create preset modal
- Configure each day of week:
  - Content topic
  - Time
  - Platforms
- Apply preset → generates full week of content

**Use:** `lib/storage.ts` - `getPresets()`, `savePreset()`
**Use:** `lib/ai-service.ts` - `generateWeeklyContent()`

---

## 🔧 Environment Setup

### 1. Update `.env` file:
```bash
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# OpenAI (Required)
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_key_here

# Anthropic (Optional fallback)
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your_key_here

# Convex (Optional)
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Sentry (Optional)
EXPO_PUBLIC_SENTRY_DSN=https://your_sentry_dsn

# Stripe (for subscriptions)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 2. Update `app.json`:
Add these to the `extra` section:
```json
{
  "expo": {
    "extra": {
      "clerkPublishableKey": process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      "openaiApiKey": process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      "anthropicApiKey": process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
      "convexUrl": process.env.EXPO_PUBLIC_CONVEX_URL,
      "sentryDsn": process.env.EXPO_PUBLIC_SENTRY_DSN,
      "stripePublishableKey": process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
  }
}
```

---

## 🎨 Design Guidelines

### Colors (Match Web App)
```typescript
const THEME = {
  colors: {
    background: '#F6F3EE',    // Page background (cream)
    card: '#FAF9F7',          // Card background (off-white)
    accent: '#C4A484',        // Primary accent (warm brown)
    text: '#3A3A3A',          // Primary text (charcoal)
    textSecondary: '#666',    // Secondary text
    border: '#E2DDD5',        // Borders
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 12,
    xl: 20,
  },
};
```

### Component Patterns
Follow the pattern established in `library.tsx`:
- Cards with shadows
- Rounded corners
- FAB for primary actions
- Modals for forms
- Empty states with icons and helpful text

---

## 📚 Code Examples & Patterns

### Using AI Service
```typescript
import { generateContent, generateHashtags, improveCaption } from '@/lib/ai-service';

// Generate content
const result = await generateContent({
  prompt: 'Write about healthy eating',
  tone: 'casual',
  platforms: ['instagram'],
  contentType: 'lifestyle',
  includeHashtags: true,
});

// Generate just hashtags
const hashtags = await generateHashtags(content, 10);

// Improve existing caption
const improved = await improveCaption(existingCaption);
```

### Using Storage
```typescript
import {
  getAllPosts,
  savePost,
  getScheduledContent,
  saveScheduledContent,
} from '@/lib/storage';

// Save post
await savePost('recipes', {
  id: Date.now().toString(),
  title: 'Smoothie Bowl',
  content: 'Try this amazing...',
  tags: '#healthy #smoothie',
  createdAt: new Date().toISOString(),
});

// Get all posts
const allPosts = await getAllPosts();

// Schedule content
await saveScheduledContent({
  id: Date.now().toString(),
  content: 'Post content here',
  date: '2025-12-01',
  time: '09:00',
  platform: ['instagram', 'facebook'],
  status: 'scheduled',
  createdAt: new Date().toISOString(),
});
```

### Using Sentiment Analysis
```typescript
import { analyzeSentiment, calculateEngagementScore } from '@/lib/sentiment-analysis';

const sentiment = analyzeSentiment(content);
// { score: 5, label: 'positive', comparative: 0.5 }

const engagement = calculateEngagementScore(content);
// {
//   score: 85,
//   factors: { length: 90, hashtags: 100, ... },
//   recommendations: ['Add a question to increase engagement']
// }
```

---

## 🚀 Next Steps

### Immediate (This Week)
1. **Implement AI Generator screen** - Highest priority, core feature
2. **Implement Calendar/Schedule screen** - Second highest priority
3. **Enhance Dashboard** - Add real stats and recent activity
4. **Update Profile screen** - Add settings and export

### Short Term (Next Week)
5. **Create Pricing screen** - Integrate Stripe
6. **Add Weekly Presets** - Batch generation feature
7. **Add shared UI components** (Toast, Button variants, etc.)
8. **Test full user flow** end-to-end

### Medium Term
9. **Add Canva integration** - Design generation
10. **Add URL parser** - Extract content from links
11. **Add trending content** - RSS feed integration
12. **Implement push notifications** - For scheduled posts

### Before Launch
13. **Set up Sentry** - Error tracking
14. **Add analytics** - User behavior tracking
15. **Performance optimization** - Code splitting, lazy loading
16. **Accessibility audit** - VoiceOver/TalkBack support
17. **Test on real devices** - iOS and Android
18. **App Store assets** - Screenshots, descriptions
19. **Submit to stores** - App Store & Play Store

---

## 📖 Key Resources

### Dependencies Used
- **expo** ~52.0.17 - React Native framework
- **@clerk/clerk-expo** ^2.18 - Authentication
- **openai** - OpenAI API client
- **@anthropic-ai/sdk** - Anthropic Claude API
- **@react-native-async-storage/async-storage** - Local storage
- **sentiment** - Sentiment analysis
- **react-native-calendars** - Calendar component
- **@stripe/stripe-react-native** - Stripe payments
- **@sentry/react-native** - Error tracking

### Documentation Links
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [Clerk Expo](https://clerk.com/docs/quickstarts/expo)
- [OpenAI API](https://platform.openai.com/docs/)
- [Anthropic API](https://docs.anthropic.com/)

### File References
- Types: `lib/types.ts`
- AI Service: `lib/ai-service.ts`
- Storage: `lib/storage.ts`
- Sentiment: `lib/sentiment-analysis.ts`
- Subscriptions: `lib/subscription-types.ts`
- Example Screen: `app/(tabs)/library.tsx`

---

## 💡 Pro Tips

1. **Test on device early** - Expo Go makes this easy
2. **Use React DevTools** - Debug component hierarchy
3. **Enable Fast Refresh** - See changes instantly
4. **Check both platforms** - iOS and Android have differences
5. **Use TypeScript** - Catch errors before runtime
6. **Follow existing patterns** - Consistency is key
7. **Start simple** - Get basic version working, then enhance

---

## ✅ Quick Win Checklist

Start here for fastest results:

- [ ] Set up `.env` with API keys
- [ ] Run `npm install` (if not done)
- [ ] Run `npm start` and test in Expo Go
- [ ] Test authentication (sign up/sign in)
- [ ] Test Library screen (already working!)
- [ ] Build AI Generator screen (use code example above)
- [ ] Build Calendar screen (use code example above)
- [ ] Enhance Dashboard with real stats
- [ ] Test full flow: Sign in → Generate → Save → Schedule
- [ ] Polish UI and fix any bugs
- [ ] Build for production

---

**You have a solid foundation!** All the hard infrastructure work is done. Now it's just about building out the UI screens using the provided utilities. The Library screen shows you exactly how to structure everything.

Good luck! 🚀
