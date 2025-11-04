import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  const { caption, platform = 'instagram' } = await request.json();

  if (!caption) {
    return NextResponse.json({ success: false, message: 'Caption is required' }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ success: false, message: 'OpenAI API key not configured' }, { status: 500 });
  }

  const platformLimits: Record<string, string> = {
    instagram: '2,200 characters with hashtags',
    twitter: '280 characters',
    facebook: 'Keep under 500 characters for best engagement',
    linkedin: '1,300-2,000 characters for professional tone'
  };

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a social media optimization expert. Improve captions for ${platform}. ${platformLimits[platform] || ''} Focus on engagement, clarity, and call-to-action.` },
        { role: 'user', content: `Improve this caption for better engagement:\n\n${caption}` }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const improvedCaption = response.choices?.[0]?.message?.content || '';
    return NextResponse.json({ success: true, original: caption, improved: improvedCaption, platform });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'OpenAI error' }, { status: 500 });
  }
}


