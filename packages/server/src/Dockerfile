# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ curl

# # Create directory for youtube-dl binary and download it
# RUN mkdir -p /usr/local/bin && \
#     curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
#     chmod a+rx /usr/local/bin/yt-dlp

# # Set environment variable to skip youtube-dl-exec postinstall
# ENV YOUTUBE_DL_SKIP_DOWNLOAD=true

# Copy package files first to leverage cache
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/

# Ensure devDependencies are installed (Coolify may inject NODE_ENV=production)
ENV NODE_ENV=development

# Install all dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy source files and templates
COPY packages/server ./packages/server

# Build the application
RUN yarn build:server

# Production stage
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies
RUN apk add --no-cache python3 curl

# Copy youtube-dl binary from builder
# COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
# RUN chmod a+rx /usr/local/bin/yt-dlp

# # Set environment variable to skip youtube-dl-exec postinstall
# ENV YOUTUBE_DL_SKIP_DOWNLOAD=true

# Copy only necessary files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/templates ./packages/server/templates

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

EXPOSE 8080

# Use production command
CMD ["yarn", "workspace", "streameth-new-server", "start:server"]
