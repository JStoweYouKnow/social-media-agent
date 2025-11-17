import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { error } = await requireAuth();
  if (error) return error;

  const { templateId, variables } = await request.json();

  if (!templateId) {
    return badRequestResponse('Template ID is required');
  }

  if (!process.env.CANVA_API_KEY) {
    return errorResponse('Canva API key not configured', 500, 'CONFIG_ERROR');
  }

  try {
    const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variables: variables || {} })
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
    return successResponse({
      designLink: data.url,
      templateId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Canva API error';
    return errorResponse(errorMessage, 500, 'CANVA_ERROR');
  }
}


