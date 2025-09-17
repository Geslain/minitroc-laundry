#FROM --platform=linux/amd64 node:22-alpine AS build_amd64
FROM node:22-alpine AS build_amd64

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including @prisma/client
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client to ensure it's available
RUN npx prisma generate

# Arguments for build-time environment variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL

# Set environment variables for build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL

# Build the application
#RUN npm run build

# Create a startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Waiting for database..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'npm run dev' >> /app/start.sh && \
#    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh


EXPOSE 3000

CMD ["/app/start.sh"]