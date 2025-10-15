Paste this into Render's "Build Command" or deploy notes when asked:

Backend (Render Web Service)
- Root Directory: <leave blank>
- Build Command: npm install
- Start Command: npm run api
- Health Check Path: /api/health

Frontend (Static Site on Render or Vercel)
- Build Command: npm run build
- Publish Directory: build
- Set environment variable (for production API): REACT_APP_API_URL=https://api.<your-domain>.com

If you see ENOENT for /opt/render/project/src/package.json, change the Root Directory to the repository root (not /src).
