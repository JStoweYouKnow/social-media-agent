import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { error } = await requireAuth();
  if (error) return error;

  const { templateId, postData, day } = await request.json();

  if (!templateId || !postData) {
    return badRequestResponse('Template ID and post data are required');
  }

  try {
    const variables: Record<string, unknown> = {
      caption: postData.caption || '',
      hashtags: postData.hashtags || '#ProjectComfort',
      date: postData.date || new Date().toLocaleDateString(),
      ...(day === 'Monday' && { quote: postData.quote || '', author: postData.author || '' }),
      ...(day === 'Wednesday' && { eventTitle: postData.title || 'Community Meetup', time: postData.time || '6:45pm', location: postData.location || 'All Saints Church' }),
      ...(day === 'Thursday' && { tip: postData.tip || postData.insight || '' }),
      ...(day === 'Friday' && { recipeTitle: postData.title || '', ingredients: postData.ingredients || '' }),
      ...(day === 'Saturday' && { workoutTitle: postData.title || '', exercises: postData.exercises || '' }),
      ...(day === 'Sunday' && { reflection: postData.reflection || '' }),
      ...(postData.imageUrl && { image: postData.imageUrl })
    };

    const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variables })
    });

    if (!response.ok) {
      const errorData = await response.json() as { message?: string };
      return errorResponse(
        errorData.message || `Canva API error: ${response.status}`,
        500,
        'CANVA_API_ERROR'
      );
    }

    const data = await response.json() as { url: string };
    return successResponse({ designLink: data.url, variables, day });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Canva API error';
    return errorResponse(errorMessage, 500, 'CANVA_ERROR');
  }
}


