# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++

# Copy root workspace files
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/

# Ensure devDependencies are installed (Coolify may inject NODE_ENV=production)
ENV NODE_ENV=development

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy application files
COPY packages/server ./packages/server

# Build the application
RUN yarn build:server

# Production stage
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies
RUN apk add --no-cache python3 ffmpeg

# Copy built artifacts from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/server/dist ./packages/server/dist

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Use production command
CMD ["yarn", "start:video-importer"]
