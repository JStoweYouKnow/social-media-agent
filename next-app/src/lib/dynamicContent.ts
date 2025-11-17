import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek, addDays, startOfWeek } from 'date-fns';
import Sentiment from 'sentiment';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { z } from 'zod';

const sentiment = new Sentiment();
const rssParser = new Parser();

// Zod schemas for AI response validation
export const CaptionResponseSchema = z.object({
  caption: z.string().min(10).max(2200),
  hashtags: z.array(z.string()).optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  engagementScore: z.number().min(0).max(10).optional(),
});

export const WeeklyContentSchema = z.object({
  posts: z.array(z.object({
    day: z.string(),
    date: z.string(),
    title: z.string(),
    content: z.string(),
    hashtags: z.string(),
    variations: z.object({
      instagram: z.string(),
      linkedin: z.string(),
      facebook: z.string(),
    }).optional(),
  })),
});

/**
 * Format dates dynamically based on context
 */
export function formatDynamicDate(date: Date, context?: 'post' | 'schedule' | 'relative'): string {
  if (context === 'relative') {
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    if (isThisWeek(date)) return formatDistanceToNow(date, { addSuffix: true });
    return format(date, 'MMMM d, yyyy');
  }
  
  if (context === 'post') {
    return format(date, 'EEEE, MMMM d'); // "Monday, January 15"
  }
  
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get relative time for engagement
 */
export function getRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Analyze sentiment of generated content
 */
export function analyzeSentiment(text: string): {
  score: number;
  comparative: number;
  positive: boolean;
  negative: boolean;
  neutral: boolean;
} {
  const result = sentiment.analyze(text);
  return {
    score: result.score,
    comparative: result.comparative,
    positive: result.score > 0,
    negative: result.score < 0,
    neutral: result.score === 0,
  };
}

/**
 * Get trending topics from RSS feeds
 */
export async function getTrendingTopics(feedUrls: string[] = []): Promise<string[]> {
  const defaultFeeds = [
    'https://rss.cnn.com/rss/edition.rss',
    'https://feeds.bbci.co.uk/news/rss.xml',
  ];

  const feeds = feedUrls.length > 0 ? feedUrls : defaultFeeds;
  const topics: string[] = [];

  try {
    for (const feedUrl of feeds) {
      try {
        const feed = await rssParser.parseURL(feedUrl);
        const titles = feed.items.slice(0, 5).map(item => item.title || '');
        topics.push(...titles);
      } catch (error) {
        console.error(`Error parsing feed ${feedUrl}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching trending topics:', error);
  }

  return topics.slice(0, 10); // Return top 10 topics
}

/**
 * Extract content from URL for context
 */
export async function extractUrlContent(url: string): Promise<{
  title: string;
  description: string;
  content: string;
  keywords: string[];
} | null> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    const content = $('article, .content, main, .post-content').first().text().slice(0, 1000) || 
                   $('body').text().slice(0, 1000);
    
    // Extract keywords from meta tags
    const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [];

    return {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      keywords,
    };
  } catch (error) {
    console.error('Error extracting URL content:', error);
    return null;
  }
}

/**
 * Generate time-sensitive context for posts
 */
export function getTimeContext(date: Date = new Date()): {
  timeOfDay: string;
  dayOfWeek: string;
  weekContext: string;
  seasonalContext: string;
  relativeTime: string;
} {
  const hour = date.getHours();
  const dayOfWeek = format(date, 'EEEE');
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const daysSinceWeekStart = Math.floor((date.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));

  let timeOfDay = 'afternoon';
  if (hour < 12) timeOfDay = 'morning';
  else if (hour >= 18) timeOfDay = 'evening';

  let weekContext = 'early';
  if (daysSinceWeekStart >= 5) weekContext = 'late';
  else if (daysSinceWeekStart >= 3) weekContext = 'mid';

  const month = date.getMonth();
  let seasonalContext = 'spring';
  if (month >= 2 && month < 5) seasonalContext = 'spring';
  else if (month >= 5 && month < 8) seasonalContext = 'summer';
  else if (month >= 8 && month < 11) seasonalContext = 'fall';
  else seasonalContext = 'winter';

  return {
    timeOfDay,
    dayOfWeek,
    weekContext,
    seasonalContext,
    relativeTime: formatDynamicDate(date, 'relative'),
  };
}

/**
 * Enhance prompt with trending topics and context
 */
export async function enhancePromptWithContext(
  basePrompt: string,
  options: {
    includeTrending?: boolean;
    includeTimeContext?: boolean;
    urlContext?: string;
  } = {}
): Promise<string> {
  let enhancedPrompt = basePrompt;
  const contexts: string[] = [];

  // Add time context
  if (options.includeTimeContext) {
    const timeCtx = getTimeContext();
    contexts.push(`Time context: ${timeCtx.dayOfWeek} ${timeCtx.timeOfDay}, ${timeCtx.weekContext} week of ${timeCtx.seasonalContext}`);
  }

  // Add trending topics
  if (options.includeTrending) {
    try {
      const topics = await getTrendingTopics();
      if (topics.length > 0) {
        contexts.push(`Current trending topics: ${topics.slice(0, 3).join(', ')}`);
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  }

  // Add URL context
  if (options.urlContext) {
    try {
      const urlContent = await extractUrlContent(options.urlContext);
      if (urlContent) {
        contexts.push(`Reference content: ${urlContent.title}. ${urlContent.description}`);
      }
    } catch (error) {
      console.error('Error extracting URL content:', error);
    }
  }

  if (contexts.length > 0) {
    enhancedPrompt = `${basePrompt}\n\nAdditional context:\n${contexts.join('\n')}`;
  }

  return enhancedPrompt;
}

/**
 * Validate AI response with Zod
 */
export function validateResponse<T>(data: unknown, schema: z.ZodSchema<T>): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Calculate engagement score based on content metrics
 */
export function calculateEngagementScore(content: string, hashtags: string[] = []): number {
  let score = 0;
  
  // Length score (optimal 150-300 chars)
  const length = content.length;
  if (length >= 150 && length <= 300) score += 3;
  else if (length >= 100 && length <= 400) score += 2;
  else score += 1;

  // Hashtag score (optimal 3-7 hashtags)
  const hashtagCount = hashtags.length;
  if (hashtagCount >= 3 && hashtagCount <= 7) score += 2;
  else if (hashtagCount > 0 && hashtagCount < 10) score += 1;

  // Question score
  if (content.includes('?')) score += 1;

  // Call-to-action score
  const ctaWords = ['join', 'learn', 'discover', 'share', 'comment', 'like', 'follow'];
  if (ctaWords.some(word => content.toLowerCase().includes(word))) score += 1;

  // Emoji score
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount >= 1 && emojiCount <= 5) score += 1;

  // Sentiment score
  const sentimentResult = analyzeSentiment(content);
  if (sentimentResult.positive) score += 1;

  return Math.min(score, 10);
}







