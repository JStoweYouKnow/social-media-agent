import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Rate limiting - 10 requests per minute per user
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  });
  if (rateLimitError) return rateLimitError;

  const { content, count = 10 } = await request.json();

  if (!content) {
    return badRequestResponse('Content is required');
  }

  if (!openai) {
    return errorResponse('OpenAI API key not configured', 500, 'CONFIG_ERROR');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a social media hashtag expert. Generate relevant, trending hashtags. Always include #ProjectComfort as the first hashtag.' },
        { role: 'user', content: `Generate ${count} relevant hashtags for this content:\n\n${content}` }
      ],
      temperature: 0.6,
      max_tokens: 200
    });

    const hashtagsText = response.choices?.[0]?.message?.content || '';
    const hashtags = hashtagsText.match(/#\w+/g) || [];
    return successResponse({ hashtags, count: hashtags.length });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI error';
    return errorResponse(errorMessage, 500, 'OPENAI_ERROR');
  }
}


