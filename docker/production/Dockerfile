FROM --platform=linux/amd64 node:22-alpine AS builder

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY ../../prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ../.. .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy prisma schema and generate client
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Create upload directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Create startup script for production
RUN echo '#!/bin/sh' > /app/start-prod.sh && \
    echo 'echo "Waiting for database..."' >> /app/start-prod.sh && \
    echo 'npx prisma migrate deploy' >> /app/start-prod.sh && \
    echo 'echo "Starting production server..."' >> /app/start-prod.sh && \
    echo 'npm start' >> /app/start-prod.sh && \
    chmod +x /app/start-prod.sh

EXPOSE 3000

CMD ["/app/start-prod.sh"]
