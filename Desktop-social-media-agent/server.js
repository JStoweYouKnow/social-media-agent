// Express server for Post Planner API routes
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes (converted to CommonJS)
const aiRoutes = require('./routes/ai.js');
const canvaRoutes = require('./routes/canva.js');
const scheduleRoutes = require('./routes/schedule.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://social-media-agent-93136-3c801.web.app',
    'https://social-media-agent-93136-3c801.firebaseapp.com',
    'https://social-media-agent-673r9z80m-james-stowes-projects.vercel.app',
    'http://localhost:3000'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes (now fully enabled)
app.use('/api/ai', aiRoutes);
app.use('/api/canva', canvaRoutes);
app.use('/api/schedule', scheduleRoutes);

// Serve React build (if it exists) for a single-service deploy
const path = require('path');
const fs = require('fs');
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('Static build detected. Serving React build from /build');
  app.use(express.static(buildPath));

  // Serve index.html for any non-API routes (client-side routing)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Post Planner API is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/ai/variation',
      '/api/ai/generate',
      '/api/ai/improve',
      '/api/ai/hashtags',
      '/api/canva/create',
      '/api/canva/autofill',
      '/api/canva/batch',
      '/api/canva/templates',
      '/api/schedule/generate-week',
      '/api/schedule/generate-day',
      '/api/schedule/weekly'
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Post Planner API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.path} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Post Planner API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📚 Available API Routes:`);
  console.log(`   ✅ AI:       /api/ai/* (OpenAI powered)`);
  console.log(`   ✅ Canva:    /api/canva/* (Design automation)`);
  console.log(`   ✅ Schedule: /api/schedule/* (Weekly generation)`);
  console.log(`\n⚙️  Environment Variables:`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   CANVA_API_KEY: ${process.env.CANVA_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`\n🎉 All routes active and ready!`);
  console.log(`� Tip: Test with http://localhost:${PORT}/api/health`);
  console.log(`\n`);
});

module.exports = app;
