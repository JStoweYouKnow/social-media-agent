import { NextResponse } from 'next/server';
import { getScheduleForDay } from '@/lib/contentSchedule';
import { generatePost } from '@/lib/postGenerator';

export async function POST(request: Request) {
  const { day, data } = await request.json();
  if (!day || !data) {
    return NextResponse.json({ success: false, message: 'Day and data are required' }, { status: 400 });
  }

  try {
    const schedule = getScheduleForDay(day);
    if (!schedule) {
      return NextResponse.json({ success: false, message: `No schedule found for day: ${day}` }, { status: 404 });
    }
    const caption = generatePost(day, data);
    return NextResponse.json({ success: true, post: { day: schedule.day, caption, type: schedule.type, template: schedule.template, source: schedule.source, description: schedule.description } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


