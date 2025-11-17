# Dynamic Content Generation Features

This document explains the new dynamic content generation features added to enhance AI-generated social media content.

## New Dependencies

The following dependencies have been added to make content generation more dynamic:

- **@anthropic-ai/sdk** - Alternative AI model (Claude) for content variety
- **date-fns** - Enhanced date formatting and time handling
- **zod** - Type-safe validation of AI responses
- **jsonschema** - JSON schema validation
- **langchain** - Advanced AI workflows (optional)
- **rss-parser** - RSS feed integration for trending topics
- **cheerio** - Web scraping for content enrichment
- **axios** - Better HTTP client for API calls
- **sentiment** - Sentiment analysis for content tone

## Enhanced Features

### 1. Multi-Model AI Support

You can now use multiple AI models (OpenAI GPT-4o-mini and Anthropic Claude) for content generation:

```typescript
// In your API request
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a post about real estate tips',
    model: 'openai', // or 'anthropic' or 'both'
    tone: 'professional'
  })
});
```

**Benefits:**
- Get different writing styles from different models
- Fallback support if one API is down
- Compare outputs for best results

### 2. Time-Aware Content Generation

Content now automatically includes time context:

```typescript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Motivational Monday post',
    day: 'Monday',
    includeTimeContext: true, // Default: true
  })
});
```

**Features:**
- Automatic time-of-day context (morning, afternoon, evening)
- Week context (early, mid, late week)
- Seasonal context (spring, summer, fall, winter)
- Relative dates ("today", "tomorrow", "in 3 days")

### 3. Trending Topics Integration

Include current trending topics in your content:

```typescript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Create a post about current events',
    includeTrending: true, // Fetches trending topics from RSS feeds
  })
});
```

**Get trending topics directly:**
```typescript
const response = await fetch('/api/ai/trending');
const { topics } = await response.json();
// topics: ["Breaking News Title 1", "Trending Topic 2", ...]
```

### 4. URL Content Extraction

Extract content from URLs to enrich your posts:

```typescript
// Extract content from a URL
const response = await fetch('/api/ai/trending', {
  method: 'POST',
  body: JSON.stringify({
    url: 'https://example.com/article'
  })
});

// Use in content generation
const generateResponse = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Create a post about this article',
    urlContext: 'https://example.com/article', // Automatically extracts and uses
  })
});
```

### 5. Sentiment Analysis

Every generated post includes sentiment analysis:

```typescript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Create an uplifting post',
  })
});

const data = await response.json();
console.log(data.sentiment);
// {
//   score: 5,
//   comparative: 0.25,
//   type: 'positive'
// }
```

### 6. Engagement Score Calculation

Get an engagement score for each post:

```typescript
const data = await response.json();
console.log(data.engagementScore); // 0-10 score
```

**Factors considered:**
- Optimal content length (150-300 chars)
- Hashtag count (3-7 optimal)
- Presence of questions
- Call-to-action words
- Emoji usage
- Sentiment positivity

### 7. Response Validation

All responses are validated with Zod schemas:

```typescript
const data = await response.json();
if (data.validation === 'valid') {
  // Content structure is valid
} else {
  console.log(data.validationErrors); // Array of error messages
}
```

### 8. Enhanced Date Formatting

Better date handling with `date-fns`:

```typescript
// In weekly generation
const response = await fetch('/api/ai/generate-week', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Generate a week of posts',
    startDate: '2024-01-15', // Optional: custom week start
  })
});

// Posts include formatted dates
const data = await response.json();
data.posts.forEach(post => {
  console.log(post.formattedDate); // "Monday, January 15"
  console.log(post.date); // "2024-01-15"
});
```

## API Endpoint Enhancements

### `/api/ai/generate` - Enhanced Single Post Generation

**New Parameters:**
- `model`: 'openai' | 'anthropic' | 'both' (default: 'openai')
- `includeTrending`: boolean (default: false)
- `includeTimeContext`: boolean (default: true)
- `urlContext`: string (optional URL to extract context from)

**Enhanced Response:**
```json
{
  "success": true,
  "caption": "Generated caption...",
  "hashtags": ["projectcomfort", "realtor"],
  "sentiment": {
    "score": 5,
    "comparative": 0.25,
    "type": "positive"
  },
  "engagementScore": 8,
  "tokens": 150,
  "model": "openai",
  "timeContext": {
    "timeOfDay": "morning",
    "dayOfWeek": "Monday",
    "weekContext": "early"
  },
  "validation": "valid"
}
```

### `/api/ai/generate-week` - Enhanced Weekly Generation

**New Parameters:**
- `model`: 'openai' | 'anthropic' | 'both'
- `includeTrending`: boolean
- `startDate`: string (ISO date for week start)

**Enhanced Response:**
```json
{
  "success": true,
  "posts": [
    {
      "day": "Monday",
      "date": "2024-01-15",
      "formattedDate": "Monday, January 15",
      "title": "Post Title",
      "content": "Post content...",
      "hashtags": ["projectcomfort"],
      "sentiment": {
        "score": 3,
        "type": "positive"
      },
      "engagementScore": 7,
      "variations": {
        "instagram": "...",
        "linkedin": "...",
        "facebook": "..."
      }
    }
  ],
  "count": 7,
  "model": "openai",
  "weekStart": "2024-01-15",
  "timeContext": {
    "weekContext": "early",
    "seasonalContext": "winter"
  },
  "validation": "valid"
}
```

### `/api/ai/trending` - New Trending Topics Endpoint

**GET** - Fetch trending topics:
```typescript
fetch('/api/ai/trending?feeds=https://rss.cnn.com/rss/edition.rss')
```

**POST** - Extract URL content:
```typescript
fetch('/api/ai/trending', {
  method: 'POST',
  body: JSON.stringify({
    url: 'https://example.com/article'
  })
});
```

## Environment Variables

Add to your `.env.local`:

```bash
# Existing
OPENAI_API_KEY=your_openai_key

# New - Optional (for Claude support)
ANTHROPIC_API_KEY=your_anthropic_key
```

## Usage Examples

### Example 1: Generate with Trending Topics

```typescript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a post about current real estate trends',
    includeTrending: true,
    tone: 'professional',
    model: 'anthropic',
  })
});

const { caption, sentiment, engagementScore } = await response.json();
```

### Example 2: Generate Week with Time Context

```typescript
const response = await fetch('/api/ai/generate-week', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Weekly community updates',
    includeTrending: true,
    startDate: new Date().toISOString(),
  })
});

const { posts, timeContext } = await response.json();
// posts are enriched with dates, sentiment, and engagement scores
```

### Example 3: Content Enrichment from URL

```typescript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Create a social media post about this article',
    urlContext: 'https://example.com/news-article',
    model: 'both', // Generate with both models for comparison
  })
});
```

## Benefits

1. **More Dynamic Content**: Time-aware, trending-topic integrated posts
2. **Better Quality**: Sentiment analysis and engagement scoring
3. **Flexibility**: Multiple AI models for variety
4. **Reliability**: Automatic fallback between models
5. **Validation**: Type-safe responses with Zod
6. **Rich Context**: URL extraction and RSS feed integration
7. **Professional Dates**: Better date formatting with date-fns

## Utility Functions Available

You can also import and use these utilities directly:

```typescript
import {
  formatDynamicDate,
  getTimeContext,
  enhancePromptWithContext,
  analyzeSentiment,
  calculateEngagementScore,
  getTrendingTopics,
  extractUrlContent,
} from '@/lib/dynamicContent';

import { generateContent, getAvailableModels } from '@/lib/aiModels';
```







