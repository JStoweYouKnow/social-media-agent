import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    endpoints: [
      '/api/ai/variation',
      '/api/ai/generate',
      '/api/ai/improve',
      '/api/ai/hashtags',
      '/api/ai/generate-week'
    ]
  });
}


