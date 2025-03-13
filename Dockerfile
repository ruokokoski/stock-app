# Use official Node.js image as base
FROM node:20.15.1-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable to prevent Puppeteer from downloading Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

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