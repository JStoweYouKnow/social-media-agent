# Dockerfile to run the Post Planner as a single container (build frontend and run backend)
# Build stage: install deps and build React app
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
# Prefer `npm install` in the builder so builds don't fail when a lockfile
# is not present in the build context (some CI providers run in subpaths).
# If you want deterministic installs in CI, ensure `package-lock.json` is
# present and replace `npm install` with `npm ci` here.
RUN npm install --silent
COPY . .
RUN npm run build --silent

# Production stage: run server and serve build
FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
# Use npm install in production stage as a fallback when lockfile is missing.
RUN npm install --only=production --silent
COPY --from=builder /usr/src/app/build ./build
COPY . .
EXPOSE 3000
CMD ["npm", "run", "api"]
