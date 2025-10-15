#!/bin/bash

echo "🔍 Post Planner API Key Checker"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "💡 Run: cp .env.example .env"
    exit 1
fi

# Load .env
source .env

echo "Checking API keys..."
echo ""

# OpenAI
if [ -n "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "sk-proj-your-key-here" ] && [ "$OPENAI_API_KEY" != "your_openai_api_key_here" ]; then
    echo "✅ OpenAI API Key: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -4}"
    OPENAI_CONFIGURED=true
else
    echo "❌ OpenAI API Key: Not configured"
    echo "   👉 Edit .env and replace 'sk-proj-your-key-here' with your actual key"
    echo "   📝 Get your key: https://platform.openai.com/api-keys"
    OPENAI_CONFIGURED=false
fi

# Canva
if [ -n "$CANVA_API_KEY" ] && [ "$CANVA_API_KEY" != "your_canva_api_key_here" ]; then
    echo "✅ Canva API Key: ${CANVA_API_KEY:0:10}...${CANVA_API_KEY: -4}"
else
    echo "⚠️  Canva API Key: Not configured (optional)"
fi

# Buffer
if [ -n "$BUFFER_ACCESS_TOKEN" ] && [ "$BUFFER_ACCESS_TOKEN" != "your_buffer_access_token_here" ]; then
    echo "✅ Buffer Access Token: ${BUFFER_ACCESS_TOKEN:0:10}...${BUFFER_ACCESS_TOKEN: -4}"
else
    echo "⚠️  Buffer Access Token: Not configured (optional)"
fi

echo ""
echo "================================"

if [ "$OPENAI_CONFIGURED" = true ]; then
    echo "🎉 OpenAI is configured! You can now:"
    echo "   1. Start API server: node server.js"
    echo "   2. Use AI features in the app"
    echo ""
    read -p "Would you like to start the API server now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting API server..."
        node server.js
    fi
else
    echo "⚠️  Please configure your OpenAI API key in .env file"
    echo ""
    echo "Quick setup:"
    echo "   1. Open .env in a text editor"
    echo "   2. Replace 'sk-proj-your-key-here' with your actual OpenAI key"
    echo "   3. Save the file"
    echo "   4. Run this script again: ./check-api-keys.sh"
fi
