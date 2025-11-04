import { NextResponse } from 'next/server';
import { getWeekSchedule } from '@/lib/contentSchedule';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDay = searchParams.get('startDay') || 'Monday';
  const schedule = getWeekSchedule(startDay);
  return NextResponse.json({ success: true, schedule, startDay, count: schedule.length });
}


