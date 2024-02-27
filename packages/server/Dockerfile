# Common build stage
FROM node:18-alpine AS base

COPY . ./app

WORKDIR /app

EXPOSE 8080

RUN yarn install

# Production build stage
FROM base
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

CMD ["yarn", "start"]
