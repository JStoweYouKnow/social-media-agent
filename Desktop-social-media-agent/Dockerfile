# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY server.js ./
COPY routes ./routes
COPY api ./api

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the server
CMD ["node", "server.js"]
