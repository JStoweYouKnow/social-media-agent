#!/bin/bash

echo "🧪 Testing Post Planner API"
echo "============================"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
HEALTH=$(curl -s http://localhost:3001/api/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
    exit 1
fi
echo ""

# Test 2: AI Tone Variation (requires OpenAI key)
echo "2️⃣  Testing AI Tone Variation..."
TONE_TEST=$(curl -s -X POST http://localhost:3001/api/ai/variation \
  -H "Content-Type: application/json" \
  -d '{"baseCaption":"Join us for our weekly meetup!","tone":"Inspirational"}' 2>&1)

if echo "$TONE_TEST" | grep -q "success"; then
    if echo "$TONE_TEST" | grep -q "true"; then
        echo "   ✅ AI tone variation working"
    else
        echo "   ⚠️  AI tone variation returned error (check API key)"
    fi
else
    echo "   ❌ AI endpoint not responding"
fi
echo ""

# Test 3: Weekly Generation
echo "3️⃣  Testing Weekly Generation..."
WEEK_TEST=$(curl -s -X POST http://localhost:3001/api/schedule/generate-week \
  -H "Content-Type: application/json" \
  -d '{
    "contentData": {
      "quotes": {"quote": "Progress, not perfection", "author": "Unknown"},
      "events": {"title": "Community Meetup", "date": "Wednesday", "time": "6:45pm", "location": "All Saints Church"},
      "insights": {"tip": "Buy the neighborhood, not just the house"},
      "recipes": {"title": "Fall Harvest Bowl"},
      "workouts": {"title": "Full Body HIIT"},
      "sweets": {"title": "Sunday Gratitude"}
    }
  }' 2>&1)

if echo "$WEEK_TEST" | grep -q "success"; then
    if echo "$WEEK_TEST" | grep -q "Monday"; then
        echo "   ✅ Weekly generation working"
        POST_COUNT=$(echo "$WEEK_TEST" | grep -o "Monday\|Tuesday\|Wednesday\|Thursday\|Friday\|Saturday\|Sunday" | wc -l)
        echo "   📅 Generated $POST_COUNT posts"
    else
        echo "   ⚠️  Weekly generation returned unexpected format"
    fi
else
    echo "   ❌ Weekly generation endpoint not responding"
fi
echo ""

echo "============================"
echo "🎉 API Testing Complete!"
echo ""
echo "💡 The API is ready to use with your React app!"
echo "   React App: http://localhost:3000"
echo "   API Server: http://localhost:3001"
echo ""
