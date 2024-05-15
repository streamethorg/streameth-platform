import { bool, cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';
// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();

const validateEnv = () => {
  return cleanEnv(process.env, {
    BASE_URL: str(),
    PLAYER_URL: str(),
    NODE_ENV: str(),
    APP_PORT: port(),
    DB_HOST: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    CORS_ORIGIN: str(),
    CORS_CREDENTIALS: bool(),
    SECRET_KEY: str(),
    JWT_SECRET: str(),
    JWT_EXPIRY: str(),
    GOOGLE_API_KEY: str(),
    LIVEPEER_BASE_URL: str(),
    LIVEPEER_API_KEY: str(),
    GITHUB_API_TOKEN: str(),
    BUCKET_NAME: str(),
    BUCKET_URL: str(),
    OPENAI_API_KEY: str(),
    SPACES_KEY: str(),
    SPACES_SECRET: str(),
    LIVEPEER_WEBHOOK_SECRET: str(),
    TELEGRAM_API_KEY: str(),
    TELEGRAM_CHAT_ID: str(),
    OAUTH_SECRET: str(),
    THIRDWEB_SECRET_KEY: str(),
    WALLET_ADDRESSES: str(),
    PRIVY_APP_ID: str(),
    PRIVY_SECRET_KEY: str(),
    TEST_URL: str()
  });
};

export default validateEnv;
