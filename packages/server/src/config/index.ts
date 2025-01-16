import validateEnv from '@utils/validateEnv';
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

const validatedEnv = validateEnv();
export const config = {
  openai: {
    apiKey: readSecretFile(validatedEnv.OPENAI_API_KEY_FILE),
  },
  gemini: {
    apiKey: readSecretFile(validatedEnv.GEMINI_API_KEY_FILE),
  },
  baseUrl: validatedEnv.BASE_URL,
  playerUrl: validatedEnv.PLAYER_URL,
  appEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.APP_PORT,
  wallets: validatedEnv.WALLET_ADDRESSES,
  db: {
    host: validatedEnv.DB_HOST,
    user: validatedEnv.DB_USER,
    name: validatedEnv.DB_NAME,
    password: readSecretFile(validatedEnv.DB_PASSWORD_FILE),
  },
  logger: {
    format: validatedEnv.LOG_FORMAT,
    dir: validatedEnv.LOG_DIR,
  },
  cors: {
    origin: validatedEnv.CORS_ORIGIN,
    credentials: validatedEnv.CORS_CREDENTIALS,
  },
  jwt: {
    secret: readSecretFile(validatedEnv.JWT_SECRET_FILE),
    expiry: validatedEnv.JWT_EXPIRY,
    magicLink: {
      secret: readSecretFile(validatedEnv.MAGIC_LINK_SECRET_FILE),
      expiry: validatedEnv.MAGIC_LINK_EXPIRY,
    },
  },
  telegram: {
    apiKey: readSecretFile(validatedEnv.TELEGRAM_API_KEY_FILE),
    chatId: readSecretFile(validatedEnv.TELEGRAM_CHAT_ID_FILE),
  },
  storage: {
    s3: {
      name: validatedEnv.BUCKET_NAME,
      host: validatedEnv.BUCKET_URL,
      secretKey: readSecretFile(validatedEnv.SPACES_SECRET_FILE),
      apiKey: readSecretFile(validatedEnv.SPACES_KEY_FILE),
    },
    thirdWebSecretKey: readSecretFile(validatedEnv.THIRDWEB_SECRET_KEY_FILE),
  },
  livepeer: {
    host: validatedEnv.LIVEPEER_BASE_URL,
    secretKey: readSecretFile(validatedEnv.LIVEPEER_API_KEY_FILE),
    webhookSecretKey: readSecretFile(validatedEnv.LIVEPEER_WEBHOOK_SECRET_FILE),
  },
  oauth: {
    google: {
      secretKey: readSecretFile(validatedEnv.GOOGLE_OAUTH_SECRET_FILE),
      clientId: readSecretFile(validatedEnv.GOOGLE_CLIENT_ID_FILE),
    },
    twitter: {
      secretKey: readSecretFile(validatedEnv.TWITTER_OAUTH_SECRET_FILE),
      clientId: readSecretFile(validatedEnv.TWITTER_CLIENT_ID_FILE),
    },
  },

  google: {
    privateKey: readSecretFile(validatedEnv.SERVICE_ACCOUNT_PRIVATE_KEY_FILE),
    accountEmail: readSecretFile(validatedEnv.SERVICE_ACCOUNT_EMAIL_FILE),
  },
  mail: {
    host: validatedEnv.MAIL_HOST,
    port: validatedEnv.MAIL_PORT,
    user: readSecretFile(validatedEnv.MAIL_USER_FILE),
    pass: readSecretFile(validatedEnv.MAIL_PASS_FILE),
  },
  remotion: {
    id: validatedEnv.REMOTION_ID,
    host: validatedEnv.REMOTION_BASE_URL,
    webhookSecretKey: readSecretFile(validatedEnv.REMOTION_WEBHOOK_SECRET_FILE),
  },
  redis: {
    host: validatedEnv.REDIS_HOST,
    port: validatedEnv.REDIS_PORT,
    password: readSecretFile(validatedEnv.REDIS_PASSWORD_FILE),
  },
};
