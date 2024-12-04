

import * as fs from 'fs';

const readSecretFile = (path: string): string => {
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (error) {
    console.error(`Error reading secret file ${path}:`, error);
    throw error;
  }
};

export const config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    password: readSecretFile(process.env.DB_PASSWORD_FILE),
  },
  logger: {
    format: process.env.LOG_FORMAT,
    dir: process.env.LOG_DIR,
  },
  storage: {
    s3: {
      name: process.env.BUCKET_NAME,
      host: process.env.BUCKET_URL,
      secretKey: readSecretFile(process.env.SPACES_SECRET_FILE),
      apiKey: readSecretFile(process.env.SPACES_KEY_FILE),
    }
  },
  livepeer: {
    host: process.env.LIVEPEER_BASE_URL,
    secretKey: readSecretFile(process.env.LIVEPEER_API_KEY_FILE),
    webhookSecretKey: readSecretFile(process.env.LIVEPEER_WEBHOOK_SECRET_FILE),
  },
  remotion: {
    id: process.env.REMOTION_ID,
    host: process.env.REMOTION_BASE_URL,
    webhookSecretKey: process.env.REMOTION_WEBHOOK_SECRET_FILE,
    webhook: {
      url: process.env.REMOTION_WEBHOOK_URL,
      secret: process.env.REMOTION_WEBHOOK_SECRET_FILE,
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: readSecretFile(process.env.REDIS_PASSWORD_FILE),
  },
};
