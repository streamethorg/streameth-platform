FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app/packages/server/reel-creator

COPY package.json ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app/packages/server/reel-creator
COPY --from=deps /app/packages/server/reel-creator/node_modules ./node_modules
COPY . .

# Install FFmpeg
RUN apk add --no-cache ffmpeg

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app/packages/server/reel-creator

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install FFmpeg in the final stage
RUN apk add --no-cache ffmpeg

COPY --from=builder /app/packages/server/reel-creator/package.json ./package.json
COPY --from=builder /app/packages/server/reel-creator/node_modules ./node_modules
COPY --from=builder /app/packages/server/reel-creator/.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]