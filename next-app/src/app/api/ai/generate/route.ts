import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import { generateContent } from '@/lib/aiModels';
import {
  getTimeContext,
  enhancePromptWithContext,
  analyzeSentiment,
  calculateEngagementScore,
  validateResponse,
  CaptionResponseSchema,
} from '@/lib/dynamicContent';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Rate limiting - 10 requests per minute per user
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  });
  if (rateLimitError) return rateLimitError;

  const { 
    prompt, 
    day, 
    tone = 'casual',
    model = 'openai',
    includeTrending = false,
    includeTimeContext = true,
    urlContext,
  } = await request.json();

  if (!prompt) {
    return badRequestResponse('Prompt is required');
  }

  const dayContext: Record<string, string> = {
    Monday: 'motivational quote or inspiration',
    Tuesday: 'meetup reminder for Wednesday event',
    Wednesday: 'main event announcement',
    Thursday: 'real estate insight or market tip',
    Friday: 'recipe or meal prep content',
    Saturday: 'workout or fitness motivation',
    Sunday: 'reflection or gratitude'
  };

  const context = day ? dayContext[day] || '' : '';
  const timeContext = includeTimeContext ? getTimeContext(new Date()) : null;

  try {
    // Enhance prompt with dynamic context
    const enhancedPrompt = await enhancePromptWithContext(
      `Create a ${tone} social media caption about: ${prompt}`,
      {
        includeTrending,
        includeTimeContext,
        urlContext,
      }
    );

    // Build system prompt with all context
    let systemPrompt = `You are a social media content creator for Project Comfort.`;
    if (context) {
      systemPrompt += ` Today is ${day}, focus on ${context}.`;
    }
    if (timeContext) {
      systemPrompt += ` It's ${timeContext.dayOfWeek} ${timeContext.timeOfDay}, ${timeContext.weekContext} week.`;
    }
    systemPrompt += ` Always include relevant hashtags including #ProjectComfort. Make the content engaging and authentic.`;

    // Generate content with selected model
    const result = await generateContent({
      prompt: enhancedPrompt,
      systemPrompt,
      model: model as 'openai' | 'anthropic' | 'both',
      temperature: tone === 'professional' ? 0.7 : tone === 'funny' ? 0.95 : 0.9,
      maxTokens: 600,
    });

    const caption = result.content;
    
    // Extract hashtags from caption
    const hashtagMatches = caption.match(/#\w+/g) || [];
    const hashtags = hashtagMatches.map(tag => tag.replace('#', ''));

    // Analyze sentiment
    const sentimentAnalysis = analyzeSentiment(caption);
    
    // Calculate engagement score
    const engagementScore = calculateEngagementScore(caption, hashtags);

    // Validate response structure
    const validation = validateResponse(
      { caption, hashtags, sentiment: sentimentAnalysis.positive ? 'positive' : sentimentAnalysis.negative ? 'negative' : 'neutral', engagementScore },
      CaptionResponseSchema
    );

    return successResponse({
      caption,
      day,
      tone,
      model: result.model,
      hashtags,
      sentiment: {
        score: sentimentAnalysis.score,
        comparative: sentimentAnalysis.comparative,
        type: sentimentAnalysis.positive ? 'positive' : sentimentAnalysis.negative ? 'negative' : 'neutral',
      },
      engagementScore,
      tokens: result.tokens,
      timeContext: timeContext ? {
        timeOfDay: timeContext.timeOfDay,
        dayOfWeek: timeContext.dayOfWeek,
        weekContext: timeContext.weekContext,
      } : null,
      validation: validation.success ? 'valid' : 'invalid',
    });
  } catch (error: unknown) {
    console.error('AI generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI generation error';
    return errorResponse(errorMessage, 500, 'AI_GENERATION_ERROR', error);
  }
}


