# Use official Node.js image as base
FROM node:20.15.1-slim

# Set working directory for the app
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install dependencies
COPY package-lock.json package.json ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start"]