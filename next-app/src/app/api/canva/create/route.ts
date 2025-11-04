import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  const { templateId, variables } = await request.json();

  if (!templateId) {
    return NextResponse.json({ success: false, message: 'Template ID is required' }, { status: 400 });
  }

  if (!process.env.CANVA_API_KEY) {
    return NextResponse.json({ success: false, message: 'Canva API key not configured' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: errorData.message || `Canva API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json() as { url: string };
    return NextResponse.json({ success: true, designLink: data.url, templateId, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


