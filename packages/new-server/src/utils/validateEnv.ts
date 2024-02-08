import { bool, cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';
// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();

const validateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str(),
    APP_PORT: port(),
    DB_HOST: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    ORIGIN: str(),
    CREDENTIALS: bool(),
    SECRET_KEY: str(),
    JWT_SECRET: str(),
    JWT_EXPIRY: str(),
    GOOGLE_API_KEY: str(),
    NEXT_PUBLIC_STUDIO_API_KEY: str(),
    GITHUB_API_TOKEN: str(),
  });
};

export default validateEnv;
