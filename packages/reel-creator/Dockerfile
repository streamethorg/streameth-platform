FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

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

# Build using npx to ensure next is found
ENV NODE_ENV=production
RUN npx next build

# Clean install only production dependencies
WORKDIR /app
RUN NODE_ENV=production yarn install --frozen-lockfile --production

WORKDIR /app/packages/reel-creator

# Start the application
CMD ["node", ".next/standalone/server.js"]
