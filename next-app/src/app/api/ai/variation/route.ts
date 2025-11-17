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

  const { baseCaption, tone } = await request.json();

  if (!baseCaption || !tone) {
    return badRequestResponse('Both baseCaption and tone are required');
  }

  if (!openai) {
    return errorResponse('OpenAI API key not configured', 500, 'CONFIG_ERROR');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a social media strategist for Project Comfort, a real estate and community-focused brand. Maintain the #ProjectComfort brand voice while adapting tone as requested.' },
        { role: 'user', content: `Rewrite the following caption in a ${tone} tone while keeping the key information and hashtags:\n\n${baseCaption}` }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const newCaption = response.choices?.[0]?.message?.content || '';
    return successResponse({ caption: newCaption, tone, originalLength: baseCaption.length, newLength: newCaption.length });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI error';
    return errorResponse(errorMessage, 500, 'OPENAI_ERROR');
  }
}


