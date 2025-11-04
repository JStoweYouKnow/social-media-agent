import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  // Protect this API route - require authentication
  const { userId, error } = await requireAuth();
  if (error) return error;

  const { prompt, day, tone = 'casual' } = await request.json();

  if (!prompt) {
    return NextResponse.json({ success: false, message: 'Prompt is required' }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ success: false, message: 'OpenAI API key not configured' }, { status: 500 });
  }

  const dayContext: Record<string, string> = {
    Monday: 'motivational quote or inspiration',
    Tuesday: 'meetup reminder for Wednesday event',
    Wednesday: 'main event announcement',
    Thursday: 'real estate insight or market tip',
    Friday: 'recipe or meal prep content',
    Saturday: 'workout or fitness motivation',
    Sunday: 'reflection or gratitude'
  };

  const context = day ? dayContext[day] || '' : '';

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a social media content creator for Project Comfort. ${context ? `Today is ${day}, focus on ${context}.` : ''} Always include relevant hashtags including #ProjectComfort.` },
        { role: 'user', content: `Create a ${tone} social media caption about: ${prompt}` }
      ],
      temperature: 0.9,
      max_tokens: 600
    });

    const caption = response.choices?.[0]?.message?.content || '';
    return NextResponse.json({ success: true, caption, day, tone });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'OpenAI error' }, { status: 500 });
  }
}


