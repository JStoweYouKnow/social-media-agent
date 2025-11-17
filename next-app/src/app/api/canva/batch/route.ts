import { requireAuth } from '@/lib/auth';
import { successResponse, badRequestResponse } from '@/lib/api-response';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { error } = await requireAuth();
  if (error) return error;

  const { designs } = await request.json();

  if (!designs || !Array.isArray(designs) || designs.length === 0) {
    return badRequestResponse('Designs array is required');
  }

  const results: Array<{ success: boolean; day?: string; templateId?: string; designLink: string }> = [];
  const errors: Array<{ day?: string; templateId?: string; error: string }> = [];

  for (const design of designs) {
    const { templateId, variables, day } = design || {};
    try {
      const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CANVA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ variables: variables || {} })
      });

      if (response.ok) {
        const data = await response.json() as { url: string };
        results.push({ success: true, day, templateId, designLink: data.url });
      } else {
        const errorData = await response.json() as { message?: string };
        errors.push({ day, templateId, error: errorData.message || `Status ${response.status}` });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ day, templateId, error: errorMessage });
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return successResponse({
    results,
    errors: errors.length > 0 ? errors : undefined,
    total: designs.length,
    successful: results.length,
    failed: errors.length,
  });
}


