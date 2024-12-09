FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package.json yarn.lock ./
COPY packages/server/reel-creator/package.json ./packages/server/reel-creator/
COPY packages/server/reel-creator ./packages/server/reel-creator

RUN yarn install --frozen-lockfile --production

WORKDIR /app/packages/server/reel-creator
RUN yarn build

CMD ["yarn", "start"]
