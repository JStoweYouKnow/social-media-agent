import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const { title, content, contentType, platform } = await request.json();

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Title or content is required' },
        { status: 400 }
      );
    }

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Based on this ${contentType || 'social media'} post for ${platform || 'social media'}, suggest 3-5 specific image/graphic recommendations that would enhance engagement and visual appeal.

Title: ${title}
Content: ${content}

For each recommendation, provide:
1. Image type (photo, illustration, graphic, infographic, etc.)
2. Specific visual elements to include
3. Style/mood (modern, minimalist, vibrant, professional, etc.)
4. Color palette suggestions
5. Text overlay recommendations (if any)

Focus on images that would:
- Complement the content theme
- Drive engagement on ${platform || 'social media'}
- Be visually appealing and on-brand
- Support the message effectively

Format as a JSON array of recommendation objects.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a visual content strategist and social media expert. Provide specific, actionable image recommendations that will enhance social media posts. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const recommendationsText = response.choices?.[0]?.message?.content || '';
    
    try {
      // Try to parse as JSON first
      const recommendations = JSON.parse(recommendationsText);
      return NextResponse.json({ 
        success: true, 
        recommendations: Array.isArray(recommendations) ? recommendations : [recommendations]
      });
    } catch (parseError) {
      // If JSON parsing fails, create structured recommendations from text
      const lines = recommendationsText.split('\n').filter(line => line.trim());
      const recommendations = [];
      
      let currentRec: any = {};
      for (const line of lines) {
        if (line.includes('Image type:') || line.includes('1.')) {
          if (Object.keys(currentRec).length > 0) {
            recommendations.push(currentRec);
          }
          currentRec = {
            type: line.replace(/^.*?Image type:\s*|^\d+\.\s*/, '').trim(),
            elements: '',
            style: '',
            colors: '',
            textOverlay: ''
          };
        } else if (line.includes('Visual elements:') || line.includes('2.')) {
          currentRec.elements = line.replace(/^.*?Visual elements:\s*|^\d+\.\s*/, '').trim();
        } else if (line.includes('Style:') || line.includes('3.')) {
          currentRec.style = line.replace(/^.*?Style:\s*|^\d+\.\s*/, '').trim();
        } else if (line.includes('Color:') || line.includes('4.')) {
          currentRec.colors = line.replace(/^.*?Color.*?:\s*|^\d+\.\s*/, '').trim();
        } else if (line.includes('Text:') || line.includes('5.')) {
          currentRec.textOverlay = line.replace(/^.*?Text.*?:\s*|^\d+\.\s*/, '').trim();
        }
      }
      
      if (Object.keys(currentRec).length > 0) {
        recommendations.push(currentRec);
      }

      return NextResponse.json({ 
        success: true, 
        recommendations: recommendations.length > 0 ? recommendations : [
          {
            type: 'High-quality photo',
            elements: 'Related to the post content',
            style: 'Clean and professional',
            colors: 'Brand-appropriate palette',
            textOverlay: 'Minimal text if needed'
          }
        ]
      });
    }
  } catch (error: any) {
    console.error('Error generating image recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image recommendations' },
      { status: 500 }
    );
  }
}


