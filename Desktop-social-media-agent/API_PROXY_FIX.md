# API Proxy Fix

## Issue
"Error generating weekly posts. Make sure the API server is running."

## Root Cause
The React app on `http://localhost:3000` was making fetch requests to `/api/schedule/generate-week` (relative path), but there was no proxy configured to forward these requests to the API server on `http://localhost:3001`.

## Solution
Added proxy configuration to `package.json`:

```json
"proxy": "http://localhost:3001"
```

This tells the React development server to proxy all API requests to the Express server running on port 3001.

## Changes Made

### 1. **Added Proxy to package.json**
**File:** `package.json`  
**Line:** Added after browserslist config  
**Change:**
```json
"proxy": "http://localhost:3001"
```

### 2. **Fixed Unused Imports in postGenerator.js**
**File:** `src/utils/postGenerator.js`  
**Lines:** 2-3  
**Before:**
```javascript
import templates, { getTemplate, detectContentType, getTemplateByTypeAndStyle, captionTemplates } from '../templates/index.js';
import { weeklySchedule, getScheduleForDay } from '../data/contentSchedule.js';
```

**After:**
```javascript
import templates, { getTemplate, detectContentType } from '../templates/index.js';
import { getScheduleForDay } from '../data/contentSchedule.js';
```

### 3. **Servers Restarted**
- API server: Running on port 3001
- React dev server: Running on port 3000 with proxy enabled

## How It Works

### Before (Broken):
```
React App (port 3000)
  ↓
  fetch('/api/schedule/generate-week')
  ↓
  ❌ 404 Not Found (no server on port 3000 handling /api routes)
```

### After (Fixed):
```
React App (port 3000)
  ↓
  fetch('/api/schedule/generate-week')
  ↓
  React Dev Server Proxy
  ↓
  http://localhost:3001/api/schedule/generate-week
  ↓
  Express API Server
  ↓
  ✅ Response
```

## Verification

### Test the API directly:
```bash
curl -X POST http://localhost:3001/api/schedule/generate-week \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "quotes": {"quote": "Test", "author": "Test"}
    }
  }'
```

### Test through React proxy:
Open browser console and run:
```javascript
fetch('/api/schedule/generate-week', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contentData: {
      quotes: { quote: "Test", author: "Test" }
    }
  })
}).then(r => r.json()).then(console.log);
```

## Current Status

✅ **API Server:** Running on port 3001  
✅ **React Dev Server:** Running on port 3000  
✅ **Proxy:** Configured and active  
✅ **Weekly Generation:** Should now work  

## Related Files

- `/package.json` - Proxy configuration
- `/server.js` - Express API server
- `/routes/schedule.js` - Schedule routes
- `/src/App.js` - Frontend fetch calls (line 5311)
- `/src/utils/postGenerator.js` - Fixed imports

## Notes

- The proxy only works in development mode
- For production, you'll need to:
  1. Build the React app: `npm run build`
  2. Serve it from Express: Add `app.use(express.static('build'));`
  3. Or deploy separately and use absolute URLs with CORS

- There are TWO versions of contentSchedule.js:
  - `/api/contentSchedule.js` - CommonJS for server (correct)
  - `/src/data/contentSchedule.js` - ES Modules for React (correct)

## Testing

1. Open http://localhost:3000
2. Navigate to the weekly generation feature
3. Click "Generate Week" button
4. Should now successfully generate posts without error

## Additional Cleanup Done

- Removed unused imports: `getTemplateByTypeAndStyle`, `captionTemplates`, `weeklySchedule`
- Fixed all ES Module vs CommonJS issues
- Ensured consistent module syntax across frontend/backend
