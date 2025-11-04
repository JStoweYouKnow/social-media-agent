import { NextResponse } from 'next/server';

export async function GET() {
  const templates = [
    { id: 'DAF_Monday_Quote', name: 'Monday Motivation Quote', day: 'Monday', description: 'Minimalist quote template with Project Comfort branding' },
    { id: 'DAF_Wednesday_Event', name: 'Wednesday Meetup Event', day: 'Wednesday', description: 'Event flyer with date, time, and location fields' },
    { id: 'DAF_Thursday_RealEstate', name: 'Thursday Real Estate Tip', day: 'Thursday', description: 'Professional tip card with house icon' },
    { id: 'DAF_Friday_Recipe', name: 'Friday Recipe Card', day: 'Friday', description: 'Recipe template with ingredients and instructions' },
    { id: 'DAF_Saturday_Workout', name: 'Saturday Workout', day: 'Saturday', description: 'Fitness motivation with exercise list' },
    { id: 'DAF_Sunday_Reflection', name: 'Sunday Reflection', day: 'Sunday', description: 'Gratitude and reflection card' }
  ];
  return NextResponse.json({ success: true, templates, count: templates.length });
}


