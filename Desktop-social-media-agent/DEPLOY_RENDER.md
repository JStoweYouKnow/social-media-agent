Render deployment notes for Post Planner

Option A — Separate services (recommended)
1. Backend (Render Web Service)
   - In Render, create a new Web Service and connect your repo.
   - Root Directory: leave blank (project root)
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm run api
   - Set env vars in Render: OPENAI_API_KEY, CANVA_API_KEY, etc.

2. Frontend (Render Static Site or Vercel recommended)
   - Build Command: npm run build
   - Publish directory: build
   - Alternatively deploy on Vercel or Netlify for easier static hosting.

Option B — Single service using Dockerfile
1. In Render create a new Web Service and select Docker.
   - Root Directory: project root
   - Dockerfile: use the repository's Dockerfile
   - Render will build the image and run the container. Make sure env vars are set.

Troubleshooting: Fixing the ENOENT (/opt/render/project/src/package.json)
- When Render reports it cannot find /opt/render/project/src/package.json it means the service's "Root Directory" is set to `src`.
- Fix: set the Root Directory to the repository root (empty) so Render will find `package.json` at `/opt/render/project/package.json`.

Quick copy/paste snippet for Render UI (Backend service settings):
- Root Directory: (empty)
- Environment: Node
- Build Command: npm install
- Start Command: npm run api
- Health check path: /api/health

If you want a single service to host both frontend and backend, use the included Dockerfile which builds the React app and copies `build/` into the runtime image so `server.js` can serve it.
