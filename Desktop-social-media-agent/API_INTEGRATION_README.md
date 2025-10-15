# Post Planner API Integration

Complete backend API for the Post Planner app with AI-powered caption generation, Canva design automation, and Buffer scheduling.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install express cors dotenv node-fetch openai
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
CANVA_API_KEY=your_canva_api_key_here
BUFFER_ACCESS_TOKEN=your_buffer_access_token_here
PORT=3001
```

### 3. Start the API Server

```bash
node server.js
```

The API will be available at `http://localhost:3001`

### 4. Start the React App

In a separate terminal:
```bash
npm start
```

The React app will be available at `http://localhost:3000`

## 📚 API Routes

### AI Routes (`/api/ai`)

#### `POST /api/ai/variation`
Generate a variation of a caption in a different tone.

**Request:**
```json
{
  "baseCaption": "Original caption text",
  "tone": "Inspirational"
}
```

**Response:**
```json
{
  "success": true,
  "caption": "Rewritten caption in inspirational tone",
  "tone": "Inspirational"
}
```

**Available Tones:**
- Casual
- Inspirational
- Educational
- Vulnerable
- Direct
- Professional
- Urgent

#### `POST /api/ai/generate`
Generate a completely new caption from a prompt.

**Request:**
```json
{
  "prompt": "Write about healthy breakfast smoothies",
  "day": "Friday",
  "tone": "casual"
}
```

#### `POST /api/ai/improve`
Improve an existing caption for engagement.

**Request:**
```json
{
  "caption": "Caption to improve",
  "platform": "instagram"
}
```

#### `POST /api/ai/hashtags`
Generate relevant hashtags for content.

**Request:**
```json
{
  "content": "Post content",
  "count": 10
}
```

### Canva Routes (`/api/canva`)

#### `POST /api/canva/create`
Generate a design from a Canva template.

**Request:**
```json
{
  "templateId": "DAF_Monday_Quote",
  "variables": {
    "caption": "Post caption",
    "date": "October 16, 2024"
  }
}
```

**Response:**
```json
{
  "success": true,
  "designLink": "https://canva.com/design/...",
  "templateId": "DAF_Monday_Quote"
}
```

#### `POST /api/canva/autofill`
Auto-populate Canva template with Post Planner data.

**Request:**
```json
{
  "templateId": "DAF_Wednesday_Event",
  "postData": {
    "caption": "Community Meetup",
    "title": "Monthly Gathering",
    "time": "6:45pm",
    "location": "All Saints Church"
  },
  "day": "Wednesday"
}
```

#### `POST /api/canva/batch`
Generate multiple designs (weekly batch).

**Request:**
```json
{
  "designs": [
    {
      "templateId": "DAF_Monday_Quote",
      "variables": { "quote": "..." },
      "day": "Monday"
    },
    {
      "templateId": "DAF_Wednesday_Event",
      "variables": { "title": "..." },
      "day": "Wednesday"
    }
  ]
}
```

#### `GET /api/canva/templates`
List available Canva templates.

### Buffer Routes (`/api/buffer`)

#### `POST /api/buffer/schedule`
Schedule a post to Buffer.

**Request:**
```json
{
  "caption": "Post text",
  "imageUrl": "https://example.com/image.jpg",
  "profileId": "YOUR_BUFFER_PROFILE_ID",
  "scheduledAt": 1697500000
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "...", ... },
  "scheduledFor": "2024-10-16T18:45:00Z"
}
```

#### `POST /api/buffer/batch`
Schedule multiple posts (weekly batch).

**Request:**
```json
{
  "posts": [
    {
      "caption": "Monday post",
      "profileId": "...",
      "scheduledAt": 1697500000,
      "day": "Monday"
    }
  ]
}
```

#### `GET /api/buffer/profiles`
Get all connected Buffer profiles.

#### `GET /api/buffer/pending/:profileId`
Get pending posts for a profile.

#### `DELETE /api/buffer/update/:updateId`
Delete a scheduled post.

#### `POST /api/buffer/update/:updateId`
Update a scheduled post.

### Schedule Routes (`/api/schedule`)

#### `POST /api/schedule/generate-week`
Generate a full week of posts using the content schedule.

**Request:**
```json
{
  "contentData": {
    "quotes": { "quote": "...", "author": "..." },
    "events": { "title": "...", "date": "...", "time": "...", "location": "..." },
    "insights": { "tip": "..." },
    "recipes": { "title": "...", "description": "..." },
    "workouts": { "title": "...", "exercises": "..." },
    "sweets": { "title": "...", "reflection": "..." }
  },
  "startDay": "Monday"
}
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "day": "Monday",
      "caption": "Generated caption...",
      "type": "Motivational",
      "template": "quote"
    }
  ],
  "count": 7
}
```

#### `POST /api/schedule/generate-day`
Generate a single day's post.

#### `GET /api/schedule/weekly`
Get the weekly content schedule.

#### `GET /api/schedule/day/:dayName`
Get schedule info for a specific day.

#### `POST /api/schedule/validate`
Validate content data before generating posts.

## 🎨 UI Features

### Tone Changer
Change the tone of generated captions:
- Select from 7 different tones
- Live preview of tone changes
- Maintains key information and hashtags

### Canva Integration
Automatically create designs:
- Enter Canva template ID
- One-click design generation
- Opens design in new tab for editing

### Buffer Scheduling
Schedule posts directly from the app:
- Enter Buffer profile ID
- Set scheduling time
- Attach images (optional)
- Immediate or scheduled posting

### Weekly Generator
Generate all 7 days at once:
- Uses content from your library
- Creates posts following weekly schedule
- Copy individual posts or batch export

## 📋 Content Schedule

The modular system follows this weekly schedule:

- **Monday:** Motivational quotes (`quote` template)
- **Tuesday:** Meetup reminders (`event` template)
- **Wednesday:** Main events (`event` template)
- **Thursday:** Real estate insights (`insight` template)
- **Friday:** Recipes (`recipePost` template)
- **Saturday:** Workouts (`fitness` template)
- **Sunday:** Reflections (`sweet` template)

## 🔧 Configuration

### API Keys

1. **OpenAI API Key:**
   - Sign up at https://platform.openai.com/
   - Go to API Keys section
   - Create new secret key
   - Model used: `gpt-4o-mini`

2. **Canva API Key:**
   - Apply for developer access at https://www.canva.com/developers/
   - Create an app
   - Get API key from dashboard
   - Set up templates with variable names

3. **Buffer Access Token:**
   - Log in to Buffer
   - Go to https://buffer.com/developers/api
   - Create an app and authorize
   - Copy access token

### Buffer Profile IDs

Get your profile IDs:
```bash
curl -X GET "https://api.bufferapp.com/1/profiles.json?access_token=YOUR_TOKEN"
```

Or use the API:
```bash
curl http://localhost:3001/api/buffer/profiles
```

### Canva Template IDs

Use these mock template IDs or replace with your own:
- `DAF_Monday_Quote` - Monday motivational quotes
- `DAF_Wednesday_Event` - Wednesday event flyers
- `DAF_Thursday_RealEstate` - Thursday real estate tips
- `DAF_Friday_Recipe` - Friday recipe cards
- `DAF_Saturday_Workout` - Saturday workout posts
- `DAF_Sunday_Reflection` - Sunday reflections

## 🛠️ Troubleshooting

### "API server not running" Error

Make sure the API server is running:
```bash
node server.js
```

You should see:
```
🚀 Post Planner API Server running on http://localhost:3001
```

### CORS Errors

The API server includes CORS middleware. If you're still getting errors:
1. Check that both servers are running
2. Verify React app is on `localhost:3000`
3. Verify API server is on `localhost:3001`

### Missing API Keys

Check the server console output. It will show which API keys are set:
```
⚙️  Environment Variables:
   OPENAI_API_KEY: ✓ Set
   CANVA_API_KEY: ✗ Missing
   BUFFER_ACCESS_TOKEN: ✗ Missing
```

## 📦 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "api": "node server.js",
    "dev": "concurrently \"npm start\" \"npm run api\"",
    "build": "react-scripts build"
  }
}
```

Then run both servers with:
```bash
npm run dev
```

## 🎯 Usage Examples

### Example 1: Change Caption Tone

```javascript
// In your React component
const handleToneChange = async (tone) => {
  const res = await fetch("/api/ai/variation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      baseCaption: currentCaption, 
      tone 
    }),
  });
  
  const data = await res.json();
  setCaption(data.caption);
};
```

### Example 2: Create Canva Design

```javascript
const handleCanvaDesign = async () => {
  const res = await fetch("/api/canva/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      templateId: "DAF_Monday_Quote", 
      variables: { 
        caption: currentCaption,
        date: new Date().toLocaleDateString()
      } 
    }),
  });
  
  const data = await res.json();
  window.open(data.designLink, "_blank");
};
```

### Example 3: Schedule to Buffer

```javascript
const handleSchedule = async () => {
  const scheduledTime = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour
  
  const res = await fetch("/api/buffer/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      caption: currentCaption,
      imageUrl: imageUrl,
      profileId: "YOUR_PROFILE_ID",
      scheduledAt: scheduledTime,
    }),
  });
  
  const data = await res.json();
  alert("Post scheduled!");
};
```

### Example 4: Generate Weekly Posts

```javascript
const handleGenerateWeek = async () => {
  const contentData = {
    quotes: { quote: "Progress, not perfection", author: "Unknown" },
    events: { title: "Community Meetup", date: "Wednesday", time: "6:45pm" },
    insights: { tip: "Buy the neighborhood, not just the house" },
    recipes: { title: "Fall Harvest Bowl", description: "Seasonal ingredients" },
    workouts: { title: "Full Body HIIT", exercises: "30 min workout" },
    sweets: { title: "Sunday Gratitude", reflection: "This week I'm grateful for..." }
  };
  
  const res = await fetch("/api/schedule/generate-week", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentData }),
  });
  
  const data = await res.json();
  setWeeklyPosts(data.posts);
};
```

## 🔐 Security Notes

- Never commit `.env` file to version control
- Add `.env` to `.gitignore`
- Rotate API keys regularly
- Use environment variables for all secrets
- Consider rate limiting in production
- Validate all user input
- Use HTTPS in production

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check server console logs
- Verify environment variables

---

Built with ❤️ for the Post Planner community
