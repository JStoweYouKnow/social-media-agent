import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  const { prompt, tone = 'casual' } = await request.json();

  if (!prompt) {
    return NextResponse.json({ success: false, message: 'Prompt is required' }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ success: false, message: 'OpenAI API key not configured' }, { status: 500 });
  }

  const systemPrompt = `You are a social media strategist for Project Comfort, a real estate and community-focused brand. 
Generate a week's worth of engaging social media posts (Monday through Sunday) based on the user's prompt.

For each day, create:
- A unique angle or topic related to the prompt
- Platform-specific variations (Instagram, LinkedIn, Facebook)
- Relevant hashtags (include #ProjectComfort)
- Engaging, ${tone} tone

Return as JSON array with this structure:
[
  {
    "day": "Monday",
    "date": "2024-01-15",
    "type": "content_type",
    "title": "Post Title",
    "description": "Brief description",
    "content": "Main post content",
    "hashtags": "#ProjectComfort #relevant #tags",
    "variations": {
      "instagram": "Instagram-optimized version (shorter, more emojis)",
      "linkedin": "LinkedIn-optimized version (professional, longer)",
      "facebook": "Facebook-optimized version (conversational, medium length)"
    }
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a week of posts about: ${prompt}` }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices?.[0]?.message?.content || '[]';
    const parsedContent = JSON.parse(content);
    const posts = parsedContent.posts || parsedContent.week || parsedContent;

    const today = new Date();
    const formattedPosts = Array.isArray(posts)
      ? posts.map((post: any, index: number) => {
          const postDate = new Date(today);
          postDate.setDate(today.getDate() + index);
          return {
            ...post,
            date: postDate.toISOString().split('T')[0],
            day: post.day || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index],
            tags: post.hashtags || post.tags || '#ProjectComfort',
            variations: post.variations || {
              instagram: post.instagram || post.content || '',
              linkedin: post.linkedin || post.content || '',
              facebook: post.facebook || post.content || ''
            }
          };
        })
      : [];

    return NextResponse.json({ success: true, posts: formattedPosts, count: formattedPosts.length, prompt });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to generate weekly posts' }, { status: 500 });
  }
}


