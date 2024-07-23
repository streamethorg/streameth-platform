# StreamETH API

## Setup Quickstart

Setting up the StreamETH backend server for development is straightforward. Here’s a quick rundown:

### Prerequisites

- Node.js (v18 or above)
- Yarn
- Git

### Environment Variables

Create a `.env` file at the root of the project and include the following variables:

```bash
NODE_ENV=development # or 'production' for production environment
APP_PORT=3000 # The port number on which the server will run
DB_HOST=<Your MongoDB Connection URL> # MongoDB URL
LOG_FORMAT=<Your Desired Log Format> # Optional: Define the logging format
LOG_DIR=<Directory for Logs> # Optional: Specify the directory for log files
CORS_ORIGIN=<Your CORS Origin Whitelist> # Define allowed origins for CORS
CORS_CREDENTIALS=true # or false; Set credentials for CORS
JWT_SECRET=<Your JWT Secret> # Generate with: openssl rand -base64 64
JWT_EXPIRY=<Token Expiry Duration> # Define JWT token expiry duration (e.g., '2h' for 2 hours)
LIVEPEER_API_KEY=<Your Livepeer API Key> # Livepeer API key
SPACES_KEY=<Your DigitalOcean Spaces Key> # DigitalOcean Spaces access key
SPACES_SECRET=<Your DigitalOcean Spaces Secret> # DigitalOcean Spaces secret key
BUCKET_NAME=<Your Bucket Name> # Bucket storage na  me
BUCKET_URL=<Your Bucket URL> # Bucket storage url
LIVEPEER_WEBHOOK_SECRET=<Your Livepeer Webhook Secret> # Livepeer webhook secret
```

### Running Locally

```bash
git clone git@github.com:streamethorg/streameth-platform.git
cd streameth-platform/packages/server
yarn install
yarn dev # or yarn dev
```
