import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  const { content, count = 10 } = await request.json();

  if (!content) {
    return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ success: false, message: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a social media hashtag expert. Generate relevant, trending hashtags. Always include #ProjectComfort as the first hashtag.' },
        { role: 'user', content: `Generate ${count} relevant hashtags for this content:\n\n${content}` }
      ],
      temperature: 0.6,
      max_tokens: 200
    });

    const hashtagsText = response.choices?.[0]?.message?.content || '';
    const hashtags = hashtagsText.match(/#\w+/g) || [];
    return NextResponse.json({ success: true, hashtags, count: hashtags.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'OpenAI error' }, { status: 500 });
  }
}


