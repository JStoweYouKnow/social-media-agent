# 🚀 Social Media Agent - AI-Powered Content Planning Platform

A comprehensive React-based social media content management system with AI-powered generation, custom categories, and intelligent scheduling.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Content Generation**: Generate weekly content using OpenAI GPT-4o-mini
- **Custom Topic Categories**: Create unlimited custom categories with icons
- **Smart Novelty System**: Prevents duplicate content across all generation modes
- **Multi-Platform Support**: Instagram, LinkedIn, Facebook optimizations
- **Advanced Scheduling**: Calendar and next-day generation modes

### 🏷️ Content Management
- **14 Built-in Categories**: Recipes, Workouts, Real Estate, Tech, Finance, etc.
- **Custom Categories**: User-defined categories with automatic integration
- **Topic Bank System**: Pre-written posts organized by category
- **Day-Specific Planning**: Monday-Sunday content organization

### 📊 Analytics & Export
- **Dashboard Statistics**: Real-time content counts and insights
- **Export Options**: CSV and JSON export functionality
- **Content Calendar**: Visual scheduling and management
- **Platform Variations**: Automatic content adaptation per platform

### 🎨 User Experience
- **Clean UI Design**: Professional amber/gold theme
- **Notebook-Style Day Tabs**: Intuitive day-based planning interface
- **Performance Optimized**: React useMemo and useCallback optimizations
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Technical Stack

- **Frontend**: React 18.2.0 with Lucide React icons
- **Backend**: Express.js with OpenAI API integration
- **Styling**: Tailwind CSS with custom amber theme
- **API**: RESTful endpoints for content generation and management
- **Performance**: Memoized calculations and optimized state management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JStoweYouKnow/social-media-agent.git
   cd social-media-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the application**
   ```bash
   # Terminal 1: Start the API server
   node server.js
   
   # Terminal 2: Start the React development server
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API Server: http://localhost:3001

## 📖 Usage Guide

### Creating Custom Categories
1. Navigate to the "Categories" tab
2. Click "Add Category"
3. Enter category name and optional emoji icon
4. Use in weekly generation or day-specific planning

### AI Content Generation
1. Select "AI-Powered" mode in weekly generation
2. Enter a theme or topic prompt
3. Choose tone (Casual, Professional, Inspirational, etc.)
4. Generate 1-4 weeks of content

### Template-Based Generation
1. Select "Template-Based" mode
2. Configure number of weeks (1-4)
3. Choose generation mode (Next 7 Days vs Calendar Week)
4. Set day-specific topics or leave as random
5. Generate content using your topic bank

### Day-Specific Planning
1. Click on any day tab (Monday-Sunday)
2. Add content manually or generate with AI
3. Save to topic bank for future use
4. Schedule posts to content calendar

## 🎯 Key Features Deep Dive

### Smart Novelty System
- Tracks all generated content using content hashing
- Prevents duplicate posts across multiple generations
- Automatic fallback when content pools are exhausted
- User-controlled history reset functionality

### Performance Optimizations
- **Memoized Statistics**: Dashboard calculations cached until content changes
- **Optimized Delete Functions**: Stable references prevent unnecessary re-renders
- **Dynamic Content Types**: System adapts to custom categories automatically
- **Efficient State Management**: Reduced re-render cycles with useCallback

### Platform-Specific Adaptations
- **Instagram**: Visual-focused with optimal hashtag usage
- **LinkedIn**: Professional tone with industry insights
- **Facebook**: Community-building with engagement prompts

## 📁 Project Structure

```
src/
├── App.js              # Main application component
├── index.js           # React entry point
├── index.css          # Global styles
├── utils/             # Utility functions
├── data/              # Static data and templates
└── templates/         # Content generation templates

api/
├── contentSchedule.js  # Content scheduling logic
├── postGenerator.js   # AI content generation
└── templates.js       # Template management

routes/
├── ai.js              # AI generation endpoints
├── canva.js           # Canva integration
└── schedule.js        # Scheduling endpoints

server.js              # Express server setup
package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
PORT=3001
NODE_ENV=development
```

### Tone Options
- **Casual**: Relaxed, conversational style
- **Professional**: Business-appropriate, polished
- **Inspirational**: Motivational and uplifting
- **Friendly**: Warm, approachable tone
- **Enthusiastic**: Energetic and exciting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- Lucide React for beautiful icons
- Tailwind CSS for styling system
- React community for excellent documentation

## 📞 Support

For support, email [your-email] or open an issue on GitHub.

---

**Built with ❤️ by [JStoweYouKnow](https://github.com/JStoweYouKnow)**