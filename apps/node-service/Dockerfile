# Use Node.js LTS Alpine for smaller image size
FROM node:18-alpine

# Create app directory and set as working directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies (use npm install for development, npm ci for production with lockfile)
RUN npm install --only=production && npm cache clean --force

# Copy application source code
COPY --chown=nodeapp:nodeapp . .

# Switch to non-root user
USER nodeapp

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

