import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  // Protect this API route - require authentication
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Rate limiting - 10 requests per minute per user
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  });
  if (rateLimitError) return rateLimitError;

  try {
    const { title, content, contentType } = await request.json();

    if (!title && !content) {
      return badRequestResponse('Title or content is required');
    }

    if (!openai) {
      return errorResponse('OpenAI API key not configured', 500, 'CONFIG_ERROR');
    }

    // Create a context-aware prompt
    const contextPrompt = getContextPrompt(contentType);
    const textToAnalyze = `Title: ${title}\n\nContent: ${content}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a social media hashtag expert. Generate 5-8 relevant, trending hashtags for the given content. ${contextPrompt} Return ONLY a JSON array of lowercase hashtag strings without the # symbol. Example: ["fitness", "workout", "health"]`,
        },
        {
          role: 'user',
          content: textToAnalyze,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let tags: string[] = [];
    try {
      tags = JSON.parse(response);
    } catch {
      // Fallback: try to extract tags from text
      const matches = response.match(/["']([a-z0-9]+)["']/gi);
      if (matches) {
        tags = matches.map(m => m.replace(/["']/g, '').toLowerCase());
      }
    }

    // Clean and validate tags
    tags = tags
      .map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(tag => tag.length > 2 && tag.length < 25)
      .slice(0, 8);

    return successResponse({ tags });
  } catch (error: unknown) {
    console.error('Error generating tags:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate tags';
    return errorResponse(errorMessage, 500, 'TAG_GENERATION_ERROR');
  }
}

function getContextPrompt(contentType: string): string {
  const contexts: Record<string, string> = {
    recipes: 'Focus on food-related, cooking, and dietary tags like healthy, vegan, quick, etc.',
    workouts: 'Focus on fitness, exercise, and wellness tags like fitness, strength, cardio, etc.',
    realestate: 'Focus on property, home, and real estate tags like property, home, investment, etc.',
    mindfulness: 'Focus on wellness, meditation, and mental health tags like meditation, wellness, selfcare, etc.',
    travel: 'Focus on travel, adventure, and destination tags like travel, adventure, wanderlust, etc.',
    tech: 'Focus on technology, coding, and software tags like tech, coding, software, ai, etc.',
    finance: 'Focus on money, investing, and financial tags like money, investing, finance, wealth, etc.',
    beauty: 'Focus on skincare, makeup, and beauty tags like beauty, skincare, makeup, glowing, etc.',
    business: 'Focus on entrepreneurship, startup, and business tags like business, entrepreneur, startup, etc.',
    lifestyle: 'Focus on lifestyle, home, and daily life tags like lifestyle, home, cozy, inspiration, etc.',
    educational: 'Focus on learning, education, and tutorial tags like learning, education, tutorial, howto, etc.',
    motivational: 'Focus on motivation, inspiration, and mindset tags like motivation, inspiration, mindset, success, etc.',
  };

  return contexts[contentType] || 'Focus on popular, trending social media tags.';
}
