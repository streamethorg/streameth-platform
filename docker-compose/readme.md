## To run dev
```
docker compose --env-file .env -f docker-compose-dev.yml up --build
```

## Docker stack deploy
docker stack deploy -c docker-compose/docker-compose.yml streameth-build --detach=false --build 