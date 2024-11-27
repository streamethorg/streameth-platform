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
  jwt: {
    secret: validatedEnv.JWT_SECRET,
    expiry: validatedEnv.JWT_EXPIRY,
    magicLink: {
      secret: validatedEnv.MAGIC_LINK_SECRET,
      expiry: validatedEnv.MAGIC_LINK_EXPIRY,
    },
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
  google: {
    apiKey: validatedEnv.GOOGLE_API_KEY,
    privateKey: validatedEnv.SERVICE_ACCOUNT_PRIVATE_KEY,
    accountEmail: validatedEnv.SERVICE_ACCOUNT_EMAIL,
  },
  mail: {
    host: validatedEnv.MAIL_HOST,
    port: validatedEnv.MAIL_PORT,
    user: validatedEnv.MAIL_USER,
    pass: validatedEnv.MAIL_PASS,
  },
  remotion: {
    id: validatedEnv.REMOTION_ID,
    host: validatedEnv.REMOTION_BASE_URL,
    webhookSecretKey: validatedEnv.REMOTION_WEBHOOK_SECRET,
    aws: {
      accessKeyId: validatedEnv.AWS_ACCESS_KEY_ID,
      secretAccessKey: validatedEnv.AWS_SECRET_ACCESS_KEY,
      region: validatedEnv.AWS_REGION,
    },
    render: {
      diskSizeInMb: validatedEnv.REMOTION_DISK_SIZE_MB,
      memorySizeInMb: validatedEnv.REMOTION_MEMORY_SIZE_MB,
      timeoutInSeconds: validatedEnv.REMOTION_TIMEOUT_SECONDS,
      siteName: validatedEnv.REMOTION_SITE_NAME,
    },
    webhook: {
      url: validatedEnv.REMOTION_WEBHOOK_URL,
      secret: validatedEnv.REMOTION_WEBHOOK_SECRET,
    }
  },
};
