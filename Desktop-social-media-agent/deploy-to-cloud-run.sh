#!/bin/bash

# Deploy Post Planner Backend to Google Cloud Run
# Usage: ./deploy-to-cloud-run.sh

set -e

echo "🚀 Deploying Post Planner API to Google Cloud Run..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Please install it first: brew install --cask google-cloud-sdk"
    exit 1
fi

# Project configuration
PROJECT_ID="social-media-agent-93136-3c801"
SERVICE_NAME="post-planner-api"
REGION="us-central1"

# Set project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Read environment variables from .env
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

OPENAI_KEY=$(grep OPENAI_API_KEY .env | cut -d '=' -f2)
CANVA_KEY=$(grep CANVA_API_KEY .env | cut -d '=' -f2 || echo "")

if [ -z "$OPENAI_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY not found in .env"
    exit 1
fi

echo "✅ Found OpenAI API key"

# Deploy to Cloud Run
echo ""
echo "🔨 Building and deploying to Cloud Run..."
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo ""

gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "OPENAI_API_KEY=$OPENAI_KEY" \
  --set-env-vars "CANVA_API_KEY=$CANVA_KEY" \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "1. Update your .env file:"
echo "   REACT_APP_API_BASE_URL=$SERVICE_URL"
echo ""
echo "2. Rebuild and deploy your frontend:"
echo "   npm run build"
echo "   firebase deploy --only hosting"
echo ""
echo "3. Test the health endpoint:"
echo "   curl $SERVICE_URL/api/health"
echo ""
