import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  const { baseCaption, tone } = await request.json();

  if (!baseCaption || !tone) {
    return NextResponse.json({ success: false, message: 'Both baseCaption and tone are required' }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ success: false, message: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a social media strategist for Project Comfort, a real estate and community-focused brand. Maintain the #ProjectComfort brand voice while adapting tone as requested.' },
        { role: 'user', content: `Rewrite the following caption in a ${tone} tone while keeping the key information and hashtags:\n\n${baseCaption}` }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const newCaption = response.choices?.[0]?.message?.content || '';
    return NextResponse.json({ success: true, caption: newCaption, tone, originalLength: baseCaption.length, newLength: newCaption.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'OpenAI error' }, { status: 500 });
  }
}


