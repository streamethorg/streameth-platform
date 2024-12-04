FROM node:18-alpine

WORKDIR /app

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++

# Copy root workspace files
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/

# Copy all server files
COPY packages/server ./packages/server

# Install dependencies (including devDependencies)
RUN yarn install --frozen-lockfile
RUN yarn run build:server

# Install nodemon globally
RUN yarn global add nodemon

EXPOSE 8080

# Use nodemon for hot reloading with explicit workspace
CMD ["yarn", "workspace", "streameth-new-server", "start:server"]
