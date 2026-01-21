# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++

# Copy root workspace files
COPY package.json yarn.lock ./
# Copy all workspace package.json files (required for yarn workspaces)
COPY packages/server/package.json ./packages/server/
COPY packages/app/package.json ./packages/app/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/video-uploader/package.json ./packages/video-uploader/
COPY packages/reel-creator/package.json ./packages/reel-creator/

# Install all dependencies (including devDependencies for build)
# Set NODE_ENV inline to override any build args injected by Coolify
RUN NODE_ENV=development yarn install

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
# Copy all workspace package.json files (required for yarn workspaces)
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/app/package.json ./packages/app/
COPY --from=builder /app/packages/contracts/package.json ./packages/contracts/
COPY --from=builder /app/packages/video-uploader/package.json ./packages/video-uploader/
COPY --from=builder /app/packages/reel-creator/package.json ./packages/reel-creator/
COPY --from=builder /app/packages/server/dist ./packages/server/dist

# Install production dependencies only
RUN NODE_ENV=production yarn install --frozen-lockfile --production

# Use production command
CMD ["yarn", "start:video-importer"]
