import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import { getWeekSchedule } from '@/lib/contentSchedule';
import { generatePost } from '@/lib/postGenerator';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { error } = await requireAuth();
  if (error) return error;

  const { contentData, startDay = 'Monday' } = await request.json();

  if (!contentData) {
    return badRequestResponse('contentData is required');
  }

  try {
    const schedule = getWeekSchedule(startDay);
    const posts: Array<{
      day: string;
      caption: string;
      type: string;
      template: string;
      source: string;
      description: string;
    }> = [];
    const errors: Array<{ day: string; error: string }> = [];

    for (const item of schedule) {
      try {
        const data = (contentData as Record<string, unknown>)[item.source];
        if (!data) {
          errors.push({ day: item.day, error: `Missing data for source: ${item.source}` });
          continue;
        }
        const caption = generatePost(item.day, data);
        posts.push({
          day: item.day,
          caption,
          type: item.type,
          template: item.template,
          source: item.source,
          description: item.description,
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ day: item.day, error: errorMessage });
      }
    }

    return successResponse({
      posts,
      errors: errors.length > 0 ? errors : undefined,
      startDay,
      count: posts.length,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate week schedule';
    return errorResponse(errorMessage, 500, 'SCHEDULE_ERROR');
  }
}


