// AI-powered caption generation routes
const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * POST /api/ai/variation
 * Generate a variation of a caption in a different tone
 * 
 * Body:
 * - baseCaption: Original caption text
 * - tone: Desired tone (casual, professional, urgent, inspirational, etc.)
 */
router.post("/variation", async (req, res) => {
  const { baseCaption, tone } = req.body;

  // Validation
  if (!baseCaption || !tone) {
    return res.status(400).json({ 
      success: false, 
      message: "Both baseCaption and tone are required" 
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a social media strategist for Project Comfort, a real estate and community-focused brand. Maintain the #ProjectComfort brand voice while adapting tone as requested." 
        },
        { 
          role: "user", 
          content: `Rewrite the following caption in a ${tone} tone while keeping the key information and hashtags:\n\n${baseCaption}` 
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const newCaption = response.choices[0].message.content;
    
    res.json({ 
      success: true, 
      caption: newCaption,
      tone: tone,
      originalLength: baseCaption.length,
      newLength: newCaption.length
    });
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/ai/generate
 * Generate a completely new caption from a prompt
 * 
 * Body:
 * - prompt: Description of what to generate
 * - day: Day of the week (Monday-Sunday) for template context
 * - tone: Optional tone preference
 */
router.post("/generate", async (req, res) => {
  const { prompt, day, tone = "casual" } = req.body;

  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      message: "Prompt is required" 
    });
  }

  try {
    // Context based on day
    const dayContext = {
      Monday: "motivational quote or inspiration",
      Tuesday: "meetup reminder for Wednesday event",
      Wednesday: "main event announcement",
      Thursday: "real estate insight or market tip",
      Friday: "recipe or meal prep content",
      Saturday: "workout or fitness motivation",
      Sunday: "reflection or gratitude"
    };

    const context = day ? dayContext[day] || "" : "";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are a social media content creator for Project Comfort. ${context ? `Today is ${day}, focus on ${context}.` : ''} Always include relevant hashtags including #ProjectComfort.` 
        },
        { 
          role: "user", 
          content: `Create a ${tone} social media caption about: ${prompt}` 
        }
      ],
      temperature: 0.9,
      max_tokens: 600
    });

    const caption = response.choices[0].message.content;
    
    res.json({ 
      success: true, 
      caption,
      day,
      tone
    });
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/ai/improve
 * Improve an existing caption for engagement
 * 
 * Body:
 * - caption: Caption to improve
 * - platform: Target platform (instagram, facebook, twitter, etc.)
 */
router.post("/improve", async (req, res) => {
  const { caption, platform = "instagram" } = req.body;

  if (!caption) {
    return res.status(400).json({ 
      success: false, 
      message: "Caption is required" 
    });
  }

  try {
    const platformLimits = {
      instagram: "2,200 characters with hashtags",
      twitter: "280 characters",
      facebook: "Keep under 500 characters for best engagement",
      linkedin: "1,300-2,000 characters for professional tone"
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are a social media optimization expert. Improve captions for ${platform}. ${platformLimits[platform] || ''} Focus on engagement, clarity, and call-to-action.` 
        },
        { 
          role: "user", 
          content: `Improve this caption for better engagement:\n\n${caption}` 
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const improvedCaption = response.choices[0].message.content;
    
    res.json({ 
      success: true, 
      original: caption,
      improved: improvedCaption,
      platform
    });
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/ai/hashtags
 * Generate relevant hashtags for content
 * 
 * Body:
 * - content: Caption or description
 * - count: Number of hashtags to generate (default: 10)
 */
router.post("/hashtags", async (req, res) => {
  const { content, count = 10 } = req.body;

  if (!content) {
    return res.status(400).json({ 
      success: false, 
      message: "Content is required" 
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a social media hashtag expert. Generate relevant, trending hashtags. Always include #ProjectComfort as the first hashtag." 
        },
        { 
          role: "user", 
          content: `Generate ${count} relevant hashtags for this content:\n\n${content}` 
        }
      ],
      temperature: 0.6,
      max_tokens: 200
    });

    const hashtagsText = response.choices[0].message.content;
    const hashtags = hashtagsText.match(/#\w+/g) || [];
    
    res.json({ 
      success: true, 
      hashtags,
      count: hashtags.length
    });
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/ai/generate-week
 * Generate a full week of social media posts based on a prompt
 * 
 * Body:
 * - prompt: User's description of what they want to post about
 * - tone: Optional tone (casual, professional, etc.)
 * - platforms: Array of platforms to generate for
 */
router.post("/generate-week", async (req, res) => {
  const { prompt, tone = 'casual', platforms = ['instagram', 'linkedin', 'facebook'] } = req.body;

  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      message: "Prompt is required" 
    });
  }

  try {
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a week of posts about: ${prompt}` }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Handle both {posts: [...]} and direct array formats
    const posts = parsedContent.posts || parsedContent.week || parsedContent;
    
    // Ensure dates are properly formatted
    const today = new Date();
    const formattedPosts = Array.isArray(posts) ? posts.map((post, index) => {
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
    }) : [];
    
    res.json({ 
      success: true, 
      posts: formattedPosts,
      count: formattedPosts.length,
      prompt: prompt
    });
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate weekly posts'
    });
  }
});

module.exports = router;
