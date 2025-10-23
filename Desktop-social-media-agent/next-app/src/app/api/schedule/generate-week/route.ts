import { NextResponse } from 'next/server';
import { getWeekSchedule } from '@/lib/contentSchedule';
import { generatePost } from '@/lib/postGenerator';

export async function POST(request: Request) {
  const { contentData, startDay = 'Monday' } = await request.json();

  if (!contentData) {
    return NextResponse.json({ success: false, message: 'contentData is required' }, { status: 400 });
  }

  try {
    const schedule = getWeekSchedule(startDay);
    const posts: any[] = [];
    const errors: any[] = [];

    for (const item of schedule) {
      try {
        const data = (contentData as Record<string, any>)[item.source];
        if (!data) {
          errors.push({ day: item.day, error: `Missing data for source: ${item.source}` });
          continue;
        }
        const caption = generatePost(item.day, data);
        posts.push({ day: item.day, caption, type: item.type, template: item.template, source: item.source, description: item.description });
      } catch (error: any) {
        errors.push({ day: item.day, error: error.message });
      }
    }

    return NextResponse.json({ success: errors.length === 0, posts, errors: errors.length ? errors : undefined, startDay, count: posts.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


