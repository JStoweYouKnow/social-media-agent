# Post Planner - Next.js Migration

This is the Next.js version of the Post Planner application, migrated from Create React App.

## Features

- **AI-Powered Content Generation**: Generate social media posts using OpenAI
- **Weekly Presets Management**: Create and manage reusable weekly posting schedules
- **Content Library**: Manage different types of content (recipes, workouts, real estate tips, etc.)
- **Canva Integration**: Generate designs using Canva API
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional, for AI features)
- Canva API key (optional, for design features)

### Installation

1. Navigate to the Next.js app directory:
   ```bash
   cd next-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your API keys to `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   CANVA_API_KEY=your_canva_api_key_here
   NEXT_PUBLIC_API_BASE_URL=
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Routes

The application includes the following API routes:

### AI Routes
- `POST /api/ai/generate` - Generate content from a prompt
- `POST /api/ai/variation` - Generate tone variations
- `POST /api/ai/improve` - Improve existing content
- `POST /api/ai/hashtags` - Generate hashtags
- `POST /api/ai/generate-week` - Generate weekly content

### Canva Routes
- `POST /api/canva/create` - Create Canva design
- `POST /api/canva/autofill` - Auto-populate Canva template
- `POST /api/canva/batch` - Batch create designs
- `GET /api/canva/templates` - List available templates

### Schedule Routes
- `POST /api/schedule/generate-week` - Generate weekly schedule
- `POST /api/schedule/generate-day` - Generate single day content
- `GET /api/schedule/weekly` - Get weekly schedule template
- `GET /api/schedule/day/[dayName]` - Get specific day schedule

## Migration Notes

This Next.js version includes:

1. **App Router**: Uses Next.js 14+ App Router for better performance
2. **TypeScript**: Full TypeScript support with proper type definitions
3. **API Routes**: Server-side API routes instead of Express server
4. **Client Components**: React components marked with 'use client' directive
5. **Environment Variables**: Uses Next.js environment variable conventions

## Differences from Original

- Simplified UI compared to the original CRA version
- Focus on core functionality (can be expanded)
- Better TypeScript support
- Server-side rendering capabilities
- Built-in API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.