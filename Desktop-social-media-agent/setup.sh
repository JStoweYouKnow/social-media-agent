#!/bin/bash

echo "🚀 Post Planner API Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and add your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - CANVA_API_KEY"
    echo "   - BUFFER_ACCESS_TOKEN"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Check required packages
echo "🔍 Checking required packages..."
REQUIRED_PACKAGES=("express" "cors" "dotenv" "node-fetch" "openai")
MISSING_PACKAGES=()

for package in "${REQUIRED_PACKAGES[@]}"; do
    if ! npm list "$package" > /dev/null 2>&1; then
        MISSING_PACKAGES+=("$package")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
    echo "📦 Installing missing packages: ${MISSING_PACKAGES[*]}"
    npm install "${MISSING_PACKAGES[@]}"
    echo ""
else
    echo "✅ All required packages installed"
    echo ""
fi

# Check .env configuration
echo "🔧 Checking environment configuration..."
source .env 2>/dev/null

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    echo "⚠️  OPENAI_API_KEY not configured"
else
    echo "✅ OPENAI_API_KEY configured"
fi

if [ -z "$CANVA_API_KEY" ] || [ "$CANVA_API_KEY" = "your_canva_api_key_here" ]; then
    echo "⚠️  CANVA_API_KEY not configured"
else
    echo "✅ CANVA_API_KEY configured"
fi

if [ -z "$BUFFER_ACCESS_TOKEN" ] || [ "$BUFFER_ACCESS_TOKEN" = "your_buffer_access_token_here" ]; then
    echo "⚠️  BUFFER_ACCESS_TOKEN not configured"
else
    echo "✅ BUFFER_ACCESS_TOKEN configured"
fi

echo ""
echo "=========================="
echo "🎉 Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "   1. Edit .env file with your API keys (if not done)"
echo "   2. Start the API server: node server.js"
echo "   3. Start the React app: npm start"
echo "   4. Or run both: npm run dev (if you have concurrently installed)"
echo ""
echo "📖 Documentation:"
echo "   - API Routes: API_INTEGRATION_README.md"
echo "   - Modular System: src/POST_GENERATOR_README.md"
echo "   - Usage Examples: src/USAGE_EXAMPLES.js"
echo ""
echo "🌐 URLs:"
echo "   - React App: http://localhost:3000"
echo "   - API Server: http://localhost:3001"
echo "   - Health Check: http://localhost:3001/api/health"
echo ""
