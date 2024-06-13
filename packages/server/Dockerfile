FROM node:20-bullseye AS base
# Alpine images might be missing some dependencies, install any system dependencies:
RUN apk add --no-cache git

WORKDIR /usr/app

# Default environment (build + run time)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# App and dev dependencies
COPY ["package.json", "./"]
RUN yarn install --production=false && yarn add --global tsoa

# Ensure node_modules/.bin is in PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

# App source
COPY . .

# Build step for production
FROM base AS production

# Run build which includes tsoa
RUN yarn build

# Prune dev dependencies, remove modules, ts files, yarn cache after build
RUN yarn install --production && \
    yarn autoclean --init && \
    yarn autoclean --force && \
    yarn cache clean

EXPOSE 8080

CMD ["yarn", "start"]