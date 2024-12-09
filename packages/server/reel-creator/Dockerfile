FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

# Copy workspace files
COPY package.json yarn.lock ./

# Ensure the directory structure exists
RUN mkdir -p packages/server/reel-creator

# Copy the reel-creator package files
COPY packages/server/reel-creator/package.json ./packages/server/reel-creator/

# Install all dependencies at the workspace root
RUN yarn install --frozen-lockfile

# Copy the source code
COPY packages/server/reel-creator ./packages/server/reel-creator

WORKDIR /app/packages/server/reel-creator

# Build using npx to ensure next is found
ENV NODE_ENV=production
RUN npx next build

# Clean install only production dependencies
RUN yarn install --frozen-lockfile --production

# Start the application
CMD ["yarn", "start"]
