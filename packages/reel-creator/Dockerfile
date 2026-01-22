FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ ffmpeg

# Copy workspace files
COPY package.json yarn.lock ./
# Copy all workspace package.json files (required for yarn workspaces)
COPY packages/reel-creator/package.json ./packages/reel-creator/
COPY packages/server/package.json ./packages/server/
COPY packages/app/package.json ./packages/app/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/video-uploader/package.json ./packages/video-uploader/

# Install all dependencies at the workspace root
# Set NODE_ENV inline to override any build args injected by Coolify
RUN NODE_ENV=development yarn install --frozen-lockfile

# Copy the source code
COPY packages/reel-creator ./packages/reel-creator

WORKDIR /app/packages/reel-creator

# Build the Next.js app
RUN NODE_ENV=production npx next build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ffmpeg

# Copy the standalone build from builder
COPY --from=builder /app/packages/reel-creator/.next/standalone ./
COPY --from=builder /app/packages/reel-creator/.next/static ./packages/reel-creator/.next/static

WORKDIR /app/packages/reel-creator

ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
