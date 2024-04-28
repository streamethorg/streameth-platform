import validateEnv from '@utils/validateEnv';

const validatedEnv = validateEnv();
export const config = {
  baseUrl: validatedEnv.BASE_URL,
  playerUrl: validatedEnv.PLAYER_URL,
  appEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.APP_PORT,
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
    thirdWebSecretKey: validatedEnv.THIRDWEB_SECRET_KEY,
  },
  livepeer: {
    host: validatedEnv.LIVEPEER_BASE_URL,
    secretKey: validatedEnv.LIVEPEER_API_KEY,
    webhookSecretKey: validatedEnv.LIVEPEER_WEBHOOK_SECRET,
  },
};
