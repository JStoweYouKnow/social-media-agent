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

  const { caption, platform = 'instagram' } = await request.json();

  if (!caption) {
    return badRequestResponse('Caption is required');
  }

  if (!openai) {
    return errorResponse('OpenAI API key not configured', 500, 'CONFIG_ERROR');
  }

  const platformLimits: Record<string, string> = {
    instagram: '2,200 characters with hashtags',
    twitter: '280 characters',
    facebook: 'Keep under 500 characters for best engagement',
    linkedin: '1,300-2,000 characters for professional tone'
  };

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a social media optimization expert. Improve captions for ${platform}. ${platformLimits[platform] || ''} Focus on engagement, clarity, and call-to-action.` },
        { role: 'user', content: `Improve this caption for better engagement:\n\n${caption}` }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const improvedCaption = response.choices?.[0]?.message?.content || '';
    return successResponse({ original: caption, improved: improvedCaption, platform });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI error';
    return errorResponse(errorMessage, 500, 'OPENAI_ERROR');
  }
}


