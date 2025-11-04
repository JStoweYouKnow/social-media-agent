import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  const { designs } = await request.json();

  if (!designs || !Array.isArray(designs) || designs.length === 0) {
    return NextResponse.json({ success: false, message: 'Designs array is required' }, { status: 400 });
  }

  const results: any[] = [];
  const errors: any[] = [];

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
    } catch (error: any) {
      errors.push({ day, templateId, error: error.message });
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return NextResponse.json({ success: errors.length === 0, results, errors: errors.length ? errors : undefined, total: designs.length, successful: results.length, failed: errors.length });
}


