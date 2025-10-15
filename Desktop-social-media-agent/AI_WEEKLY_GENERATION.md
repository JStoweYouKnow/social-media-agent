# AI-Powered Weekly Generation Feature

## Overview
The Weekly Generation feature is now **prompt-based** using OpenAI's GPT-4 to generate an entire week's worth of social media content from a simple text description.

**Date:** October 13, 2025  
**Status:** ✅ Fully Implemented

---

## Features

### 🤖 AI-Powered Generation
- **Natural Language Input:** Describe what you want to post about
- **Full Week Coverage:** Generates 7 unique posts (Monday-Sunday)
- **Platform Variations:** Automatic optimization for Instagram, LinkedIn, and Facebook
- **Tone Selection:** Choose from 5 different tones
- **Smart Scheduling:** Auto-assigns dates starting from today

### 📝 Template-Based Generation (Legacy)
- Original method using Topic Bank content
- Still available for users who prefer manual control
- Fallback option if AI generation fails

---

## How to Use

### Step 1: Enter Your Prompt
In the Weekly Generation section, describe what you want:

**Example Prompts:**
```
"Focus on holiday home buying tips, winter recipes, and staying motivated during the busy season"

"Share real estate market insights, workout motivation, and healthy meal prep ideas"

"Community events, mindfulness practices, and success stories from local homeowners"

"Tips for first-time home buyers, easy recipes for busy professionals, and weekly workout challenges"
```

### Step 2: Select Tone
Choose from:
- **Casual** - Friendly and conversational
- **Professional** - Polished and business-like
- **Inspirational** - Motivating and uplifting
- **Friendly** - Warm and approachable
- **Enthusiastic** - Energetic and exciting

### Step 3: Generate
Click **"Generate with AI"** and wait 10-20 seconds while AI creates your content.

### Step 4: Review & Add to Calendar
- AI generates 7 posts with platform-specific variations
- Posts are automatically added to your content calendar
- Each post includes:
  - Title and description
  - Instagram, LinkedIn, and Facebook versions
  - Relevant hashtags (including #ProjectComfort)
  - Auto-assigned dates

---

## API Endpoint

### POST `/api/ai/generate-week`

**Request Body:**
```json
{
  "prompt": "Your description of the week's content",
  "tone": "casual",
  "platforms": ["instagram", "linkedin", "facebook"]
}
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "day": "Monday",
      "date": "2025-10-13",
      "type": "motivational",
      "title": "Start Strong",
      "description": "Monday motivation for home buyers",
      "content": "Main post content...",
      "hashtags": "#ProjectComfort #MondayMotivation #RealEstate",
      "tags": "#ProjectComfort #relevant #tags",
      "variations": {
        "instagram": "Instagram version with emojis...",
        "linkedin": "Professional LinkedIn version...",
        "facebook": "Conversational Facebook version..."
      }
    }
    // ... 6 more days
  ],
  "count": 7,
  "prompt": "Original prompt"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Frontend Implementation

### New State Variables
```javascript
const [weeklyPrompt, setWeeklyPrompt] = useState('');
const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
```

### New Function: `handleGenerateWeekWithAI()`
**Location:** `src/App.js` lines 5297-5356

**Features:**
- Validates prompt is not empty
- Calls `/api/ai/generate-week` endpoint
- Transforms AI response to calendar format
- Adds posts to content calendar
- Handles errors gracefully
- Clears prompt on success

### UI Components Added
**Location:** `src/App.js` lines 6114-6175

**Elements:**
1. **Textarea** - For entering weekly prompt
2. **Tone Selector** - Dropdown for tone selection
3. **Generate with AI Button** - Primary CTA
4. **Use Templates Button** - Secondary option for legacy method
5. **Helper Text** - Tips for better prompts

---

## Backend Implementation

### New Route: `/api/ai/generate-week`
**File:** `routes/ai.js` lines 244-356

**AI System Prompt:**
```
You are a social media strategist for Project Comfort, a real estate 
and community-focused brand. Generate a week's worth of engaging social 
media posts (Monday through Sunday) based on the user's prompt.

For each day, create:
- A unique angle or topic related to the prompt
- Platform-specific variations (Instagram, LinkedIn, Facebook)
- Relevant hashtags (include #ProjectComfort)
- Engaging, [tone] tone
```

**OpenAI Configuration:**
- **Model:** gpt-4o-mini
- **Temperature:** 0.8 (creative but consistent)
- **Max Tokens:** 3000 (enough for 7 detailed posts)
- **Response Format:** JSON object

**Features:**
- Parses JSON response from OpenAI
- Handles different response formats
- Auto-generates dates (today + 0-6 days)
- Ensures all posts have required fields
- Provides fallbacks for missing data

---

## Error Handling

### Frontend Errors
```javascript
// Empty prompt
if (!weeklyPrompt.trim()) {
  alert('Please enter a prompt...');
  return;
}

// API errors
catch (error) {
  alert('Error generating weekly posts. Make sure the API server 
         is running and OpenAI API key is configured.');
}
```

### Backend Errors
```javascript
// Missing prompt
if (!prompt) {
  return res.status(400).json({ 
    success: false, 
    message: "Prompt is required" 
  });
}

// OpenAI errors
catch (error) {
  res.status(500).json({ 
    success: false, 
    message: error.message || 'Failed to generate weekly posts'
  });
}
```

---

## Comparison: AI vs Template

| Feature | AI-Powered | Template-Based |
|---------|-----------|----------------|
| **Input** | Natural language prompt | Pre-filled Topic Bank |
| **Flexibility** | High - any topic | Limited to templates |
| **Speed** | 10-20 seconds | Instant |
| **Consistency** | AI-driven variety | Fixed format |
| **Platform Optimization** | Automatic | Manual |
| **Customization** | Tone selection | Direct editing |
| **Cost** | Uses OpenAI API | Free |
| **Quality** | High, contextual | Depends on templates |

---

## Example Workflows

### Workflow 1: Real Estate Focus
```
Prompt: "Weekly real estate tips covering market trends, 
         home staging, mortgage rates, and buyer success stories"

Tone: Professional

Result: 
- Monday: Market update and trends
- Tuesday: Home staging tips
- Wednesday: Understanding mortgage rates
- Thursday: First-time buyer advice
- Friday: Success story feature
- Saturday: Weekend open house tips
- Sunday: Reflection on finding the perfect home
```

### Workflow 2: Wellness & Community
```
Prompt: "Community wellness focus with healthy recipes, 
         workout motivation, and mindfulness practices"

Tone: Inspirational

Result:
- Monday: Week-starting motivation
- Tuesday: Community meetup reminder
- Wednesday: Mindfulness practice
- Thursday: Quick healthy recipe
- Friday: Meal prep for the weekend
- Saturday: Weekend workout challenge
- Sunday: Gratitude and reflection
```

### Workflow 3: Seasonal Content
```
Prompt: "Fall season content about cozy home ideas, 
         autumn recipes, and preparing homes for winter"

Tone: Casual

Result:
- Monday: Fall home decor inspiration
- Tuesday: Cozy recipe roundup
- Wednesday: Seasonal maintenance tips
- Thursday: Autumn entertaining ideas
- Friday: Pumpkin spice everything
- Saturday: Weekend DIY projects
- Sunday: Grateful for fall moments
```

---

## Best Practices

### Writing Effective Prompts

**✅ DO:**
- Be specific about topics
- Mention themes or events
- Include variety (recipes, tips, motivation)
- Specify audience if relevant
- Mention seasonal or timely content

**❌ DON'T:**
- Use vague descriptions like "good posts"
- Over-constrain (let AI be creative)
- Forget to mention #ProjectComfort alignment
- Ignore your audience preferences

### Examples:

**Good Prompt:**
```
"Create engaging posts about sustainable home improvements, 
 energy-saving tips, eco-friendly recipes, and green living 
 motivation for environmentally conscious homeowners"
```

**Poor Prompt:**
```
"Make some posts"
```

---

## Testing

### Manual Test:
1. Open http://localhost:3000
2. Navigate to Weekly Generation section
3. Enter prompt: "Test content about real estate and wellness"
4. Select tone: Casual
5. Click "Generate with AI"
6. Wait ~15 seconds
7. Verify 7 posts appear in calendar

### API Test:
```bash
curl -X POST http://localhost:3001/api/ai/generate-week \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Real estate tips and healthy living",
    "tone": "casual",
    "platforms": ["instagram", "linkedin", "facebook"]
  }' | jq
```

### Expected Output:
```json
{
  "success": true,
  "posts": [ /* 7 post objects */ ],
  "count": 7,
  "prompt": "Real estate tips and healthy living"
}
```

---

## Requirements

### Environment Variables
```env
OPENAI_API_KEY=sk-proj-...  # Required for AI generation
```

### Dependencies
- OpenAI Node.js SDK (already installed)
- React state management
- Fetch API

### Cost Considerations
- **Model:** gpt-4o-mini (~$0.01-0.02 per week generation)
- **Token Usage:** ~2000-3000 tokens per request
- **Monthly Estimate:** ~$1-2 for 100 weeks

---

## Troubleshooting

### Issue: "Error generating weekly posts"
**Causes:**
- API server not running
- OpenAI API key missing or invalid
- Network connectivity issue

**Solutions:**
1. Check server is running: `lsof -i :3001`
2. Verify API key in `.env` file
3. Check API log: `tail -f api.log`
4. Test API directly with curl

### Issue: "Empty or incomplete response"
**Causes:**
- OpenAI quota exceeded
- Invalid prompt
- Rate limiting

**Solutions:**
1. Check OpenAI account quota
2. Simplify prompt
3. Wait and retry
4. Use template method as fallback

### Issue: "Posts not appearing in calendar"
**Causes:**
- Response parsing error
- Calendar state not updating

**Solutions:**
1. Check browser console for errors
2. Verify post format matches calendar structure
3. Try refreshing the page

---

## Future Enhancements

### Potential Improvements:
1. **Prompt Templates** - Pre-made prompts for common themes
2. **Save Prompts** - Store and reuse successful prompts
3. **Batch Generation** - Generate multiple weeks at once
4. **Edit Before Adding** - Review and modify posts before calendar addition
5. **Regenerate Single Day** - Keep week, regenerate one day
6. **Style Learning** - Learn from user's preferred post styles
7. **Image Suggestions** - AI-suggested images for each post
8. **Hashtag Analysis** - Recommend trending hashtags
9. **Scheduling Integration** - Auto-schedule to platforms
10. **Analytics** - Track which AI prompts perform best

---

## Files Modified

### Frontend:
- `/src/App.js`
  - Line 150: Added `weeklyPrompt` state
  - Lines 5297-5356: New `handleGenerateWeekWithAI()` function
  - Lines 6114-6175: Updated UI with prompt input and AI button

### Backend:
- `/routes/ai.js`
  - Lines 244-356: New `/api/ai/generate-week` endpoint

### Documentation:
- `AI_WEEKLY_GENERATION.md` (this file)

---

## Summary

✅ **AI-powered weekly generation is now live!**

**Key Features:**
- Natural language prompts
- 7 days of content in one click
- Platform-optimized variations
- Multiple tone options
- Auto-scheduling with dates

**How It Works:**
1. User describes desired content
2. AI generates 7 unique, themed posts
3. Posts include Instagram, LinkedIn, and Facebook versions
4. Automatically added to content calendar

**Fallback:**
- Template-based generation still available
- Uses Topic Bank content
- Provides consistency and control

**Next Steps:**
- Test the feature in the app
- Experiment with different prompts
- Provide feedback for improvements

🎉 **Enjoy effortless weekly content creation!**
