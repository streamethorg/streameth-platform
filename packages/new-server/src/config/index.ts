import validateEnv from '@utils/validateEnv';

const validatedEnv = validateEnv();
export const config = {
  appEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  db: {
    host: validatedEnv.DB_HOST,
    port: validatedEnv.DB_PORT,
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
};
