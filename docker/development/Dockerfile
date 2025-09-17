FROM node:22-alpine AS development

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Set environment variables
ENV NODE_ENV=development

# Create a startup script for development
RUN echo '#!/bin/sh' > /app/start-dev.sh && \
    echo 'echo "Waiting for database..."' >> /app/start-dev.sh && \
    echo 'npx prisma migrate deploy' >> /app/start-dev.sh && \
    echo 'echo "Starting development server..."' >> /app/start-dev.sh && \
    echo 'npm run dev' >> /app/start-dev.sh && \
    chmod +x /app/start-dev.sh

# Create upload directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

EXPOSE 3000

CMD ["/app/start-dev.sh"]
