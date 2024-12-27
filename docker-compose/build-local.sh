#!/bin/bash

docker build -f packages/server/workers/session-transcriptions/Dockerfile . -t session-transcriptions:1
docker build -f packages/server/workers/stage-transcriptions/Dockerfile . -t stage-transcriptions:1
docker build -f packages/server/src/Dockerfile . -t server:1