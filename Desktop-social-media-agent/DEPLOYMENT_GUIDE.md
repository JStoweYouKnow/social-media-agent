# Deploy Backend to Google Cloud Run

This guide walks you through deploying your Post Planner backend API to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account** - You already have one (using Firebase)
2. **Google Cloud CLI** - Install it first
3. **Billing enabled** - Cloud Run requires billing (very cheap, ~$5-10/month)

## Step 1: Install Google Cloud CLI

### macOS:
```bash
# Using Homebrew (recommended)
brew install --cask google-cloud-sdk

# Or using curl
curl https://sdk.cloud.google.com | bash
```

After installation, restart your terminal and run:
```bash
gcloud init
```

## Step 2: Set Up Your Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project (use your Firebase project ID)
gcloud config set project social-media-agent-93136-3c801

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Step 3: Deploy to Cloud Run

From your project directory (`/Users/v/Desktop-social-media-agent`):

```bash
# Deploy directly (Cloud Build will build the Docker image for you)
gcloud run deploy post-planner-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY="$(grep OPENAI_API_KEY .env | cut -d '=' -f2)" \
  --set-env-vars CANVA_API_KEY="$(grep CANVA_API_KEY .env | cut -d '=' -f2 || echo '')" \
  --platform managed \
  --memory 512Mi \
  --cpu 1
```

**Note:** The command above:
- Reads your API keys from `.env` file
- Deploys to `us-central1` region
- Allocates 512MB RAM and 1 CPU
- Allows unauthenticated requests (needed for your frontend)

## Step 4: Get Your Cloud Run URL

After deployment completes, you'll see output like:
```
Service URL: https://post-planner-api-XXXXX-uc.a.run.app
```

Copy this URL!

## Step 5: Update Your Environment Variables

Update your `.env` file:

```bash
# Replace the Railway URL with your new Cloud Run URL
REACT_APP_API_BASE_URL=https://post-planner-api-XXXXX-uc.a.run.app
```

## Step 6: Rebuild and Deploy Frontend to Firebase

```bash
# Rebuild React app with new API URL
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Step 7: Test Your Deployment

Visit your Firebase app: https://social-media-agent-93136-3c801.web.app

Try:
1. Import your preset JSON
2. Select the preset
3. Click "Generate Week"
4. Content should generate successfully!

## Monitoring & Logs

```bash
# View logs
gcloud run logs read post-planner-api --region us-central1

# Follow logs in real-time
gcloud run logs tail post-planner-api --region us-central1
```

## Update Deployment

When you make changes to your backend:

```bash
# Just run the deploy command again
gcloud run deploy post-planner-api \
  --source . \
  --region us-central1
```

Cloud Run will automatically rebuild and redeploy.

## Pricing

Google Cloud Run pricing (very affordable):
- **Free tier**: 2 million requests/month
- **After free tier**: ~$0.40 per million requests
- **Your expected cost**: $5-10/month for moderate usage

## Troubleshooting

### Check if service is running:
```bash
gcloud run services describe post-planner-api --region us-central1
```

### Test the health endpoint:
```bash
curl https://YOUR-CLOUD-RUN-URL/api/health
```

### View recent logs:
```bash
gcloud run logs read post-planner-api --region us-central1 --limit 50
```

## CORS Configuration

The server.js already has CORS configured for your Firebase domain. After deployment, add your Cloud Run URL to the CORS whitelist in `server.js`:

```javascript
app.use(cors({
  origin: [
    'https://social-media-agent-93136-3c801.web.app',
    'https://social-media-agent-93136-3c801.firebaseapp.com',
    'http://localhost:3000'
  ]
}));
```

Then redeploy.

---

## Quick Command Reference

```bash
# Deploy
gcloud run deploy post-planner-api --source . --region us-central1

# View logs
gcloud run logs tail post-planner-api --region us-central1

# Update environment variables
gcloud run services update post-planner-api \
  --region us-central1 \
  --set-env-vars OPENAI_API_KEY=your-new-key

# Delete service (if needed)
gcloud run services delete post-planner-api --region us-central1
```

## Next Steps

After successful deployment:
1. ✅ Test the preset generation feature
2. ✅ Monitor logs for any errors
3. ✅ Set up billing alerts in Google Cloud Console
4. ✅ Consider setting up a custom domain (optional)
