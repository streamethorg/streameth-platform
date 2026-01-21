import validateEnv from '@utils/validateEnv';
import * as fs from 'fs';

// Get secret value - supports both direct env vars (Coolify) and file-based secrets (Docker Swarm)
const getSecret = (directValue: string | undefined, filePath: string | undefined): string => {
  // In development, return the direct value or file path as-is
  if (process.env.NODE_ENV === 'development') {
    return directValue || filePath || '';
  }

  // Prefer direct environment variable (Coolify style)
  if (directValue) {
    return directValue;
  }

  // Fall back to file-based secret (Docker Swarm style)
  if (filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8').trim();
    } catch (error) {
      console.error(`Error reading secret file ${filePath}:`, error);
      throw error;
    }
  }

  return '';
};

const validatedEnv = validateEnv();
export const config = {
  openai: {
    apiKey: getSecret(validatedEnv.OPENAI_API_KEY, validatedEnv.OPENAI_API_KEY_FILE),
  },
  gemini: {
    apiKey: getSecret(validatedEnv.GEMINI_API_KEY, validatedEnv.GEMINI_API_KEY_FILE),
  },
  baseUrl: validatedEnv.BASE_URL,
  playerUrl: validatedEnv.PLAYER_URL,
  frontendUrl: validatedEnv.FRONTEND_URL,
  appEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.APP_PORT,
  wallets: validatedEnv.WALLET_ADDRESSES,
  db: {
    host: validatedEnv.DB_HOST,
    user: validatedEnv.DB_USER,
    name: validatedEnv.DB_NAME,
    password: getSecret(validatedEnv.DB_PASSWORD, validatedEnv.DB_PASSWORD_FILE),
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
    secret: getSecret(validatedEnv.JWT_SECRET, validatedEnv.JWT_SECRET_FILE),
    expiry: validatedEnv.JWT_EXPIRY,
    magicLink: {
      secret: getSecret(validatedEnv.MAGIC_LINK_SECRET, validatedEnv.MAGIC_LINK_SECRET_FILE),
      expiry: validatedEnv.MAGIC_LINK_EXPIRY,
    },
  },
  telegram: {
    apiKey: getSecret(validatedEnv.TELEGRAM_API_KEY, validatedEnv.TELEGRAM_API_KEY_FILE),
    chatId: getSecret(validatedEnv.TELEGRAM_CHAT_ID, validatedEnv.TELEGRAM_CHAT_ID_FILE),
  },
  storage: {
    s3: {
      name: validatedEnv.BUCKET_NAME,
      host: validatedEnv.BUCKET_URL,
      secretKey: getSecret(validatedEnv.SPACES_SECRET, validatedEnv.SPACES_SECRET_FILE),
      apiKey: getSecret(validatedEnv.SPACES_KEY, validatedEnv.SPACES_KEY_FILE),
    },
    thirdWebSecretKey: getSecret(validatedEnv.THIRDWEB_SECRET_KEY, validatedEnv.THIRDWEB_SECRET_KEY_FILE),
  },
  livepeer: {
    host: validatedEnv.LIVEPEER_BASE_URL,
    secretKey: getSecret(validatedEnv.LIVEPEER_API_KEY, validatedEnv.LIVEPEER_API_KEY_FILE),
    webhookSecretKey: getSecret(validatedEnv.LIVEPEER_WEBHOOK_SECRET, validatedEnv.LIVEPEER_WEBHOOK_SECRET_FILE),
  },
  oauth: {
    google: {
      secretKey: getSecret(validatedEnv.GOOGLE_OAUTH_SECRET, validatedEnv.GOOGLE_OAUTH_SECRET_FILE),
      clientId: getSecret(validatedEnv.GOOGLE_CLIENT_ID, validatedEnv.GOOGLE_CLIENT_ID_FILE),
    },
    twitter: {
      secretKey: getSecret(validatedEnv.TWITTER_OAUTH_SECRET, validatedEnv.TWITTER_OAUTH_SECRET_FILE),
      clientId: getSecret(validatedEnv.TWITTER_CLIENT_ID, validatedEnv.TWITTER_CLIENT_ID_FILE),
    },
  },
  google: {
    privateKey: getSecret(validatedEnv.SERVICE_ACCOUNT_PRIVATE_KEY, validatedEnv.SERVICE_ACCOUNT_PRIVATE_KEY_FILE),
    accountEmail: getSecret(validatedEnv.SERVICE_ACCOUNT_EMAIL, validatedEnv.SERVICE_ACCOUNT_EMAIL_FILE),
  },
  mail: {
    host: validatedEnv.MAIL_HOST,
    port: validatedEnv.MAIL_PORT,
    user: getSecret(validatedEnv.MAIL_USER, validatedEnv.MAIL_USER_FILE),
    pass: getSecret(validatedEnv.MAIL_PASS, validatedEnv.MAIL_PASS_FILE),
  },
  remotion: {
    id: validatedEnv.REMOTION_ID,
    host: validatedEnv.REMOTION_BASE_URL,
    webhookSecretKey: getSecret(validatedEnv.REMOTION_WEBHOOK_SECRET, validatedEnv.REMOTION_WEBHOOK_SECRET_FILE),
  },
  redis: {
    host: validatedEnv.REDIS_HOST,
    port: validatedEnv.REDIS_PORT,
    password: getSecret(validatedEnv.REDIS_PASSWORD, validatedEnv.REDIS_PASSWORD_FILE),
  },
  stripe: {
    apiKey: getSecret(validatedEnv.STRIPE_SECRET_KEY, validatedEnv.STRIPE_SECRET_KEY_FILE),
    publishableKey: getSecret(validatedEnv.STRIPE_PUBLISHABLE_KEY, validatedEnv.STRIPE_PUBLISHABLE_KEY_FILE),
  },
};
