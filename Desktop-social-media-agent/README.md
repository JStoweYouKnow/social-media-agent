# Post Planner - AI-powered Social Media Content Planning

A modern Next.js application for managing and scheduling social media content with AI-powered generation capabilities.

## 🚀 Live Demo

**Production URL**: https://next-na7kpgnic-james-stowes-projects.vercel.app

## ✨ Features

### 📊 Dashboard
- Comprehensive content statistics
- Weekly planning overview
- Category management
- Content usage tracking

### 📝 Content Management
- **13 Content Categories**: Recipes, Workouts, Real Estate, Mindfulness, Travel, Tech, Finance, Beauty, Parenting, Business, Lifestyle, Educational, Motivational
- **Full CRUD Operations**: Create, read, update, delete content
- **Content Preview**: Modal previews for all content items
- **Usage Tracking**: Mark content as used/unused
- **Copy to Clipboard**: Easy content copying functionality

### 📅 Calendar Scheduling
- **Interactive Calendar**: Visual calendar with content scheduling
- **Multi-Platform Support**: Instagram, Facebook, LinkedIn, Twitter
- **Status Tracking**: Draft, Scheduled, Published statuses
- **Date/Time Management**: Flexible scheduling options

### 🤖 AI Tools
- **Content Generation**: AI-powered content creation
- **Tone Modification**: Change content tone (Casual, Inspirational, Educational, etc.)
- **Weekly Planning**: Generate content for entire weeks
- **Hashtag Generation**: AI-powered hashtag suggestions

### ⚙️ Weekly Presets
- **Schedule Templates**: Pre-configured weekly posting schedules
- **Platform Management**: Multi-platform posting strategies
- **Topic Assignment**: Assign specific topics to days
- **Import/Export**: Save and share preset configurations

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **AI Integration**: OpenAI API
- **Design Integration**: Canva API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Desktop-social-media-agent
   ```

2. **Navigate to the Next.js app**
   ```bash
   cd next-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   Create a `.env.local` file in the `next-app` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   CANVA_API_KEY=your_canva_api_key_here
   NEXT_PUBLIC_API_BASE_URL=
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
next-app/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── ai/             # AI endpoints
│   │   │   ├── canva/          # Canva integration
│   │   │   └── schedule/       # Scheduling endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── CalendarComponent.tsx
│   │   ├── ContentManager.tsx
│   │   └── WeeklyPresetsManager.tsx
│   └── lib/
│       ├── contentLibrary.ts
│       ├── contentSchedule.ts
│       ├── firebase.ts
│       ├── postGenerator.ts
│       └── templates.ts
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## 🔧 API Endpoints

### AI Endpoints
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/variation` - Change content tone
- `POST /api/ai/generate-week` - Generate weekly content
- `POST /api/ai/hashtags` - Generate hashtags
- `POST /api/ai/improve` - Improve existing content

### Canva Integration
- `POST /api/canva/create` - Create Canva design
- `POST /api/canva/autofill` - Auto-fill template
- `POST /api/canva/batch` - Batch operations
- `GET /api/canva/templates` - Get available templates

### Scheduling
- `POST /api/schedule/generate-week` - Generate weekly schedule
- `POST /api/schedule/generate-day` - Generate daily content
- `GET /api/schedule/weekly` - Get weekly schedule
- `GET /api/schedule/day/[dayName]` - Get day-specific content

## 🎨 Customization

### Content Categories
The app supports 13 different content categories, each with specialized fields:

- **Recipes**: Ingredients, Cooking Time
- **Workouts**: Duration, Difficulty
- **Real Estate**: Property Type, Market Area
- **Mindfulness**: Practice Type, Duration
- **Travel**: Destination, Trip Type
- **Tech**: Category, Skill Level
- **Finance**: Type, Amount Range
- **Beauty**: Category, Skin Type
- **Business**: Industry, Business Stage
- **Lifestyle**: Category, Season
- **Educational**: Subject, Level
- **Motivational**: Theme, Audience

### Styling
The app uses Tailwind CSS with a custom color palette:
- **Primary**: Amber (#F59E0B)
- **Secondary**: Orange (#EA580C)
- **Accent**: Warm orange (#F4A261)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**# Trigger deployment
