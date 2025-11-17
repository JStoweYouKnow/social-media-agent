import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import { generateContent } from '@/lib/aiModels';
import { addDays, startOfWeek } from 'date-fns';
import {
  formatDynamicDate,
  getTimeContext,
  enhancePromptWithContext,
  analyzeSentiment,
  calculateEngagementScore,
  validateResponse,
  WeeklyContentSchema,
} from '@/lib/dynamicContent';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Rate limiting - 5 requests per minute for weekly generation (more expensive)
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5, // Lower limit for expensive operations
  });
  if (rateLimitError) return rateLimitError;

  const { 
    prompt, 
    tone = 'casual',
    model = 'openai',
    includeTrending = false,
    startDate,
  } = await request.json();

  if (!prompt) {
    return badRequestResponse('Prompt is required');
  }

  // Calculate week start date
  const weekStart = startDate ? new Date(startDate) : startOfWeek(new Date(), { weekStartsOn: 1 });
  const timeContext = getTimeContext(weekStart);

  const systemPrompt = `You are a social media strategist for Project Comfort, a real estate and community-focused brand. 
Generate a week's worth of engaging social media posts (Monday through Sunday) based on the user's prompt.

Current context: ${timeContext.dayOfWeek}, ${timeContext.weekContext} week of ${timeContext.seasonalContext}.

For each day, create:
- A unique angle or topic related to the prompt
- Platform-specific variations (Instagram, LinkedIn, Facebook)
- Relevant hashtags (include #ProjectComfort)
- Engaging, ${tone} tone
- Vary the content style and topics to keep the week interesting and diverse

Return as JSON object with a "posts" array containing this structure:
{
  "posts": [
    {
      "day": "Monday",
      "date": "2024-01-15",
      "type": "content_type",
      "title": "Post Title",
      "description": "Brief description",
      "content": "Main post content",
      "hashtags": "#ProjectComfort #relevant #tags",
      "variations": {
        "instagram": "Instagram-optimized version (shorter, more emojis)",
        "linkedin": "LinkedIn-optimized version (professional, longer)",
        "facebook": "Facebook-optimized version (conversational, medium length)"
      }
    }
  ]
}`;

  try {
    // Enhance prompt with trending topics if requested
    const enhancedPrompt = await enhancePromptWithContext(
      `Generate a week of posts about: ${prompt}`,
      {
        includeTrending,
        includeTimeContext: true,
      }
    );

    // Generate content with selected model
    const result = await generateContent({
      prompt: enhancedPrompt,
      systemPrompt,
      model: model as 'openai' | 'anthropic' | 'both',
      temperature: 0.8,
      maxTokens: 3000,
    });

    const content = result.content;
    let parsedContent: { posts?: unknown[]; week?: unknown[]; [key: string]: unknown };
    
    try {
      // Try to parse JSON (handle both JSON strings and objects)
      parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      // If parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    const posts = parsedContent.posts || parsedContent.week || (Array.isArray(parsedContent) ? parsedContent : []);

    // Format posts with proper dates using date-fns
    const formattedPosts = Array.isArray(posts)
      ? (posts as Array<Record<string, unknown>>).map((post: Record<string, unknown>, index: number) => {
          const postDate = addDays(weekStart, index);
          const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          
          // Extract hashtags
          const hashtagsValue = typeof post.hashtags === 'string' ? post.hashtags : '';
          const hashtagMatches = hashtagsValue.match(/#\w+/g) || [];
          const hashtags = hashtagMatches.map((tag: string) => tag.replace('#', ''));
          
          // Analyze sentiment for each post
          const contentText = (typeof post.content === 'string' ? post.content : '') || 
                             (typeof post.variations === 'object' && post.variations !== null && 
                              typeof (post.variations as Record<string, unknown>).instagram === 'string' 
                              ? (post.variations as Record<string, unknown>).instagram as string : '') || '';
          const sentimentAnalysis = analyzeSentiment(contentText);
          const engagementScore = calculateEngagementScore(contentText, hashtags);

          return {
            ...post,
            date: formatDynamicDate(postDate),
            day: (typeof post.day === 'string' ? post.day : dayNames[index]),
            formattedDate: formatDynamicDate(postDate, 'post'),
            tags: hashtagsValue || (typeof post.tags === 'string' ? post.tags : '#ProjectComfort'),
            hashtags,
            sentiment: {
              score: sentimentAnalysis.score,
              type: sentimentAnalysis.positive ? 'positive' : sentimentAnalysis.negative ? 'negative' : 'neutral',
            },
            engagementScore,
            variations: (typeof post.variations === 'object' && post.variations !== null ? post.variations : {}) || {
              instagram: (typeof post.instagram === 'string' ? post.instagram : '') || contentText,
              linkedin: (typeof post.linkedin === 'string' ? post.linkedin : '') || contentText,
              facebook: (typeof post.facebook === 'string' ? post.facebook : '') || contentText
            }
          };
        })
      : [];

    // Validate weekly content structure
    const validation = validateResponse(
      { posts: formattedPosts },
      WeeklyContentSchema
    );

    return successResponse({ 
      posts: formattedPosts, 
      count: formattedPosts.length, 
      prompt,
      model: result.model,
      tokens: result.tokens,
      weekStart: formatDynamicDate(weekStart),
      timeContext: {
        weekContext: timeContext.weekContext,
        seasonalContext: timeContext.seasonalContext,
      },
      validation: validation.success ? 'valid' : 'invalid',
      validationErrors: validation.errors?.errors.map(e => e.message),
    });
  } catch (error: unknown) {
    console.error('Weekly generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate weekly posts';
    return errorResponse(errorMessage, 500, 'WEEKLY_GENERATION_ERROR');
  }
}


