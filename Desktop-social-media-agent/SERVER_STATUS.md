# Server Status & Troubleshooting Guide

## Current Status ✅

**Date:** October 13, 2025  
**Time:** 1:08 PM PST

### Servers Running:

| Server | Port | Status | PID | URL |
|--------|------|--------|-----|-----|
| **API Server** | 3001 | ✅ Running | 95488 | http://localhost:3001 |
| **React Dev Server** | 3000 | ✅ Running | 97869 | http://localhost:3000 |

### Proxy Configuration:

✅ **Configured in package.json**
```json
"proxy": "http://localhost:3001"
```

✅ **Tested and Working**
```bash
curl http://localhost:3000/api/health
# Returns: {"status":"ok","message":"Post Planner API is running"...}
```

---

## How to Access

### Frontend (React App):
🌐 **http://localhost:3000**

### API Endpoints (Direct):
- 🏥 Health Check: http://localhost:3001/api/health
- 📅 Generate Week: POST http://localhost:3001/api/schedule/generate-week
- 🤖 AI Generate: POST http://localhost:3001/api/ai/generate
- 🎨 Canva Create: POST http://localhost:3001/api/canva/create

### API Endpoints (Through Proxy):
When using the React app, all `/api/*` requests automatically proxy to port 3001:
- 🏥 http://localhost:3000/api/health
- 📅 http://localhost:3000/api/schedule/generate-week
- 🤖 http://localhost:3000/api/ai/generate

---

## Available API Endpoints

From the health check response:

1. **AI Routes:**
   - `/api/ai/variation` - Generate content variations
   - `/api/ai/generate` - Generate AI content
   - `/api/ai/improve` - Improve existing content
   - `/api/ai/hashtags` - Generate hashtags

2. **Canva Routes:**
   - `/api/canva/create` - Create Canva design
   - `/api/canva/autofill` - Autofill Canva template
   - `/api/canva/batch` - Batch create designs
   - `/api/canva/templates` - Get Canva templates

3. **Schedule Routes:**
   - `/api/schedule/generate-week` - Generate weekly posts
   - `/api/schedule/generate-day` - Generate single day post
   - `/api/schedule/weekly` - Get weekly schedule

---

## Troubleshooting

### Error: "Make sure the API server is running"

**Check 1: Are both servers running?**
```bash
lsof -i :3000 -i :3001 | grep LISTEN
```
Should show 2 processes.

**Check 2: Is the proxy configured?**
```bash
grep proxy package.json
```
Should show: `"proxy": "http://localhost:3001"`

**Check 3: Test the proxy**
```bash
curl http://localhost:3000/api/health
```
Should return JSON with status "ok".

### Starting the Servers

**Start API Server:**
```bash
# Background mode
nohup node server.js > api.log 2>&1 &

# Foreground mode (for debugging)
node server.js
```

**Start React Dev Server:**
```bash
# With explicit port
PORT=3000 npm start

# Default (should use port 3000)
npm start
```

**Start Both (Development Mode):**
```bash
# In separate terminals:
# Terminal 1:
node server.js

# Terminal 2:
npm start
```

### Stopping the Servers

**Stop All Node Processes:**
```bash
killall -9 node
```

**Stop Specific Port:**
```bash
# Find process
lsof -i :3001 | grep LISTEN
# Kill by PID
kill -9 <PID>
```

### Common Issues

**Issue 1: Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:**
```bash
# Find and kill the process
lsof -i :3001 | grep LISTEN
kill -9 <PID>
```

**Issue 2: Proxy Not Working**
**Symptoms:** API calls get 404 errors
**Solution:**
1. Verify proxy in package.json
2. Restart React dev server (proxy only loads on startup)
3. Clear browser cache

**Issue 3: CORS Errors**
**Symptoms:** Browser console shows CORS policy errors
**Solution:** Use the proxy (don't call API directly from browser)

**Issue 4: Module Import Errors**
**Symptoms:** "Cannot find module" or "require is not defined"
**Solution:**
- Backend (routes, api folders): Use CommonJS (`require`, `module.exports`)
- Frontend (src folder): Use ES Modules (`import`, `export`)

---

## Testing the Weekly Generation

### From Browser Console:
```javascript
fetch('/api/schedule/generate-week', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contentData: {
      quotes: { 
        quote: "Start your week strong", 
        author: "Anonymous",
        context: "Motivation for Monday" 
      },
      events: { 
        title: "Community Meetup", 
        date: "Wednesday", 
        location: "Church Hall" 
      },
      insights: { 
        tip: "Market update", 
        context: "Real estate trends" 
      },
      recipes: { 
        title: "Healthy Recipe", 
        description: "Quick and nutritious" 
      },
      workouts: { 
        title: "Full Body Workout", 
        exercises: "Strength training" 
      },
      sweets: { 
        title: "Sunday Reflection", 
        reflection: "Gratitude practice" 
      }
    }
  })
})
.then(r => r.json())
.then(data => {
  console.log('Success:', data);
  alert(`Generated ${data.posts?.length || 0} posts!`);
})
.catch(err => {
  console.error('Error:', err);
  alert('Error: ' + err.message);
});
```

### From Command Line:
```bash
curl -X POST http://localhost:3001/api/schedule/generate-week \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "quotes": {"quote": "Test", "author": "Test", "context": "Test"},
      "events": {"title": "Event", "date": "Wednesday"},
      "insights": {"tip": "Tip", "context": "Context"},
      "recipes": {"title": "Recipe", "description": "Desc"},
      "workouts": {"title": "Workout", "exercises": "Exercises"},
      "sweets": {"title": "Reflection", "reflection": "Reflection"}
    }
  }' | jq
```

---

## Logs

### API Server Logs:
```bash
# View last 50 lines
tail -50 api.log

# Follow logs in real-time
tail -f api.log

# Search for errors
grep -i error api.log
```

### React Dev Server:
- Logs appear in the terminal where you ran `npm start`
- Check browser console for client-side errors (F12 → Console)

---

## Environment Variables

Located in `.env` file:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...

# Canva
CANVA_APP_ID=AAG1qNyhKWk
CANVA_CLIENT_ID=OC-AZnc1d9zDGz-
CANVA_CLIENT_SECRET=REDACTED
CANVA_API_KEY=OC-AZnc1d9zDGz-

# Server
PORT=3001
```

**Check Environment Variables:**
```bash
cat .env | grep -v "^#"
```

---

## Quick Reference Commands

### Status Check:
```bash
# Check running servers
lsof -i :3000 -i :3001 | grep LISTEN

# Test API
curl http://localhost:3000/api/health

# View logs
tail -20 api.log
```

### Restart Everything:
```bash
# Kill all
killall -9 node

# Start API
nohup node server.js > api.log 2>&1 &

# Start React (in background)
PORT=3000 npm start > /dev/null 2>&1 &

# Wait and verify
sleep 10 && lsof -i :3000 -i :3001 | grep LISTEN
```

### Clean Restart:
```bash
# Full cleanup
killall -9 node
rm -rf node_modules/.cache
rm -f api.log

# Restart
nohup node server.js > api.log 2>&1 &
PORT=3000 npm start
```

---

## Architecture

```
┌─────────────────────────────────────┐
│   Browser (http://localhost:3000)  │
│            React App                │
└──────────────┬──────────────────────┘
               │
               │ fetch('/api/...')
               ↓
┌─────────────────────────────────────┐
│   React Dev Server (Port 3000)     │
│   - Serves React app                │
│   - Proxies /api/* requests         │
└──────────────┬──────────────────────┘
               │
               │ Proxy to localhost:3001
               ↓
┌─────────────────────────────────────┐
│   Express API Server (Port 3001)   │
│   - /api/ai/* routes                │
│   - /api/canva/* routes             │
│   - /api/schedule/* routes          │
└─────────────────────────────────────┘
```

---

## Summary

✅ **Both servers running**  
✅ **Proxy configured and tested**  
✅ **All API endpoints accessible**  
✅ **Ready for weekly post generation**

**Next Steps:**
1. Open http://localhost:3000 in your browser
2. Navigate to the weekly generation feature
3. Generate posts - should work without errors!

**If you still get errors:**
1. Check browser console (F12) for specific error messages
2. Check api.log for backend errors
3. Verify both servers are running with `lsof -i :3000 -i :3001`
4. Test proxy with `curl http://localhost:3000/api/health`
