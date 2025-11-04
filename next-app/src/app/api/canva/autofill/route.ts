import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  const { templateId, postData, day } = await request.json();

  if (!templateId || !postData) {
    return NextResponse.json({ success: false, message: 'Template ID and post data are required' }, { status: 400 });
  }

  try {
    const variables: Record<string, any> = {
      caption: postData.caption || '',
      hashtags: postData.hashtags || '#ProjectComfort',
      date: postData.date || new Date().toLocaleDateString(),
      ...(day === 'Monday' && { quote: postData.quote || '', author: postData.author || '' }),
      ...(day === 'Wednesday' && { eventTitle: postData.title || 'Community Meetup', time: postData.time || '6:45pm', location: postData.location || 'All Saints Church' }),
      ...(day === 'Thursday' && { tip: postData.tip || postData.insight || '' }),
      ...(day === 'Friday' && { recipeTitle: postData.title || '', ingredients: postData.ingredients || '' }),
      ...(day === 'Saturday' && { workoutTitle: postData.title || '', exercises: postData.exercises || '' }),
      ...(day === 'Sunday' && { reflection: postData.reflection || '' }),
      ...(postData.imageUrl && { image: postData.imageUrl })
    };

    const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CANVA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variables })
    });

    if (!response.ok) {
      const errorData = await response.json() as { message?: string };
      return NextResponse.json({ success: false, message: errorData.message || `Canva API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json() as { url: string };
    return NextResponse.json({ success: true, designLink: data.url, variables, day });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


