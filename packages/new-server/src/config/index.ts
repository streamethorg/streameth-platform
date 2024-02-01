import validateEnv from '@utils/validateEnv';

const validatedEnv = validateEnv();
export const config = {
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
    origin: validatedEnv.ORIGIN,
    credentials: validatedEnv.CREDENTIALS,
  },
  secretKey: validatedEnv.SECRET_KEY,
  jwt: {
    secret: validatedEnv.JWT_SECRET,
    expiry: validatedEnv.JWT_EXPIRY,
  },
};
