import { NextResponse } from 'next/server';
import { getScheduleForDay } from '@/lib/contentSchedule';

export async function GET(_: Request, { params }: { params: Promise<{ dayName: string }> }) {
  const { dayName } = await params;
  const schedule = getScheduleForDay(dayName);
  if (!schedule) {
    return NextResponse.json({ success: false, message: `No schedule found for day: ${dayName}` }, { status: 404 });
  }
  return NextResponse.json({ success: true, schedule });
}


