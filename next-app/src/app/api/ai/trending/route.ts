import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import { getTrendingTopics, extractUrlContent } from '@/lib/dynamicContent';

/**
 * GET /api/ai/trending - Get trending topics from RSS feeds
 */
export async function GET(request: Request) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Rate limiting - 10 requests per minute per user
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  });
  if (rateLimitError) return rateLimitError;

  try {
    const { searchParams } = new URL(request.url);
    const feedUrls = searchParams.get('feeds')?.split(',') || [];

    const topics = await getTrendingTopics(feedUrls.length > 0 ? feedUrls : undefined);

    return successResponse({
      topics,
      count: topics.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching trending topics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending topics';
    return errorResponse(errorMessage, 500, 'TRENDING_ERROR');
  }
}

/**
 * POST /api/ai/trending - Extract content from URL for context
 */
export async function POST(request: Request) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  // Rate limiting - 10 requests per minute per user
  const rateLimitError = await checkRateLimit(request, userId || 'anonymous', {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  });
  if (rateLimitError) return rateLimitError;

  try {
    const { url } = await request.json();

    if (!url) {
      return badRequestResponse('URL is required');
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return badRequestResponse('Invalid URL format');
    }

    const content = await extractUrlContent(url);

    if (!content) {
      return errorResponse('Failed to extract content from URL', 500, 'EXTRACTION_ERROR');
    }

    return successResponse({
      content,
      url,
    });
  } catch (error: unknown) {
    console.error('Error extracting URL content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract URL content';
    return errorResponse(errorMessage, 500, 'EXTRACTION_ERROR');
  }
}







