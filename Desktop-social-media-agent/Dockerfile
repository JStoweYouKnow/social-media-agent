# Dockerfile to run the Post Planner as a single container (build frontend and run backend)
# Build stage: install deps and build React app
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent
COPY . .
RUN npm run build --silent

# Production stage: run server and serve build
FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent || npm install --only=production --silent
COPY --from=builder /usr/src/app/build ./build
COPY . .
EXPOSE 3000
CMD ["npm", "run", "api"]
