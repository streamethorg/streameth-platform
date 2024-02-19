# Importer Service Setup Guide

## Setting Up Environment Variables

1. create a file named `.env` in the importer directory.
2. Use `env.example` as a reference to populate the `.env` file with the necessary environment variables.
3. Fill in the environment variables with your specific values:
   - `DB_HOST`: Your MongoDB connection URL.
   - `GOOGLE_API_KEY`: The API key for accessing Google services.
   - `SERVICE_ACCOUNT_PRIVATE_KEY`: Your Google service account private key.
   - `SERVICE_ACCOUNT_EMAIL`: The email associated with your Google service account.
   - `REDIS_HOST`: The URL for your Redis host.
   - `CRONJOB_ID`: A unique identifier for the cron job (can be any random string).
   - `SECRET_KEY`: A unique identifier for the cron job (can be any random string).
     **Important Notes:**

- To obtain your Google service account key, visit the Google Cloud Console at [console.cloud.google.com](https://console.cloud.google.com/).

## Running the Importer Service

Here are the steps to execute the Importer Service in different environments:

To run the service in either development or production mode, execute command below to install all dependencies

```
yarn install
```

### Development Environment

```
yarn dev
```

### Production Environment

For production deployment, build the service and then start it by running:

```
yarn build && yarn start
```
