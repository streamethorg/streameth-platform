import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';
dotenv.config();

const validateEnv = () => {
  return cleanEnv(process.env, {
    DB_HOST: str(),
    GOOGLE_API_KEY: str(),
    SECRET_KEY: str(),
    SERVICE_ACCOUNT_PRIVATE_KEY: str(),
    SERVICE_ACCOUNT_EMAIL: str(),
    REDIS_HOST: str(),
    CRONJOB_ID: str(),
  });
};
const env = validateEnv();
export const config = {
  db: {
    host: env.DB_HOST,
  },
  google: {
    apiKey: env.GOOGLE_API_KEY,
    privateKey: env.SERVICE_ACCOUNT_PRIVATE_KEY,
    accountEmail: env.SERVICE_ACCOUNT_EMAIL,
  },
  redis: {
    host: env.REDIS_HOST,
  },
  secretKey: env.SECRET_KEY,
  jobId: env.CRONJOB_ID,
};
