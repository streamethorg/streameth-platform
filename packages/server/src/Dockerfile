# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first to leverage cache
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/

# Install all dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy source files
COPY packages/server ./packages/server

# Build the application
RUN yarn build:server

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production-only dependencies
RUN apk add --no-cache python3

# Copy only necessary files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/server/dist ./packages/server/dist

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

EXPOSE 8080

# Use production command
CMD ["yarn", "workspace", "streameth-new-server", "start:server"]
