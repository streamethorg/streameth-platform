FROM node:22-alpine

WORKDIR /app

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++
RUN apk add --no-cache ffmpeg

# Copy root workspace files
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Copy application files
COPY packages/server ./packages/server
RUN yarn build:server
# Use production command
CMD ["yarn", "start:stage-transcriptions"]
