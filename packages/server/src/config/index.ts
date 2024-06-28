import validateEnv from '@utils/validateEnv';

const validatedEnv = validateEnv();
export const config = {
  baseUrl: validatedEnv.BASE_URL,
  testUrl: validatedEnv.TEST_URL,
  playerUrl: validatedEnv.PLAYER_URL,
  appEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.APP_PORT,
  wallets: validatedEnv.WALLET_ADDRESSES,
  db: {
    host: validatedEnv.DB_HOST,
  },
  logger: {
    format: validatedEnv.LOG_FORMAT,
    dir: validatedEnv.LOG_DIR,
  },
  cors: {
    origin: validatedEnv.CORS_ORIGIN,
    credentials: validatedEnv.CORS_CREDENTIALS,
  },
  secretKey: validatedEnv.SECRET_KEY,
  jwt: {
    secret: validatedEnv.JWT_SECRET,
    expiry: validatedEnv.JWT_EXPIRY,
  },
  telegram: {
    apiKey: validatedEnv.TELEGRAM_API_KEY,
    chatId: validatedEnv.TELEGRAM_CHAT_ID,
  },
  storage: {
    s3: {
      name: validatedEnv.BUCKET_NAME,
      host: validatedEnv.BUCKET_URL,
      secretKey: validatedEnv.SPACES_SECRET,
      apiKey: validatedEnv.SPACES_KEY,
    },
    thirdWebSecretKey: validatedEnv.THIRDWEB_SECRET_KEY,
  },
  livepeer: {
    host: validatedEnv.LIVEPEER_BASE_URL,
    secretKey: validatedEnv.LIVEPEER_API_KEY,
    webhookSecretKey: validatedEnv.LIVEPEER_WEBHOOK_SECRET,
  },
  privy: {
    appId: validatedEnv.PRIVY_APP_ID,
    appSecret: validatedEnv.PRIVY_SECRET_KEY,
  },
  oauth: {
    google: {
      secretKey: validatedEnv.GOOGLE_OAUTH_SECRET,
      clientId: validatedEnv.GOOGLE_CLIENT_ID,
    },
    twitter: {
      secretKey: validatedEnv.TWITTER_OAUTH_SECRET,
      clientId: validatedEnv.TWITTER_CLIENT_ID,
    },
  },
  mq: {
    host: validatedEnv.MQ_HOST,
    port: validatedEnv.MQ_PORT,
    username: validatedEnv.MQ_USERNAME,
    secret: validatedEnv.MQ_SECRET,
  },
  firebaseServiceAccount: validatedEnv.FIREBASE_SERVICE_ACCOUNT,
};
