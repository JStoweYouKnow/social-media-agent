import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, badRequestResponse, notFoundResponse } from '@/lib/api-response';
import { getScheduleForDay } from '@/lib/contentSchedule';
import { generatePost } from '@/lib/postGenerator';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { error } = await requireAuth();
  if (error) return error;

  const { day, data } = await request.json();
  if (!day || !data) {
    return badRequestResponse('Day and data are required');
  }

  try {
    const schedule = getScheduleForDay(day);
    if (!schedule) {
      return notFoundResponse(`No schedule found for day: ${day}`);
    }
    const caption = generatePost(day, data);
    return successResponse({
      post: {
        day: schedule.day,
        caption,
        type: schedule.type,
        template: schedule.template,
        source: schedule.source,
        description: schedule.description,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate post';
    return errorResponse(errorMessage, 500, 'GENERATION_ERROR');
  }
}


