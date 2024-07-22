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
    JWT_SECRET: str(),
    JWT_EXPIRY: str(),
    LIVEPEER_BASE_URL: str(),
    LIVEPEER_API_KEY: str(),
    BUCKET_NAME: str(),
    BUCKET_URL: str(),
    SPACES_KEY: str(),
    SPACES_SECRET: str(),
    LIVEPEER_WEBHOOK_SECRET: str(),
    TELEGRAM_API_KEY: str(),
    TELEGRAM_CHAT_ID: str(),
    PRIVY_APP_ID: str(),
    PRIVY_SECRET_KEY: str(),
    TEST_URL: str(),
    GOOGLE_OAUTH_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    TWITTER_OAUTH_SECRET: str(),
    TWITTER_CLIENT_ID: str(),
    THIRDWEB_SECRET_KEY: str(),
    MQ_HOST: str(),
    MQ_PORT: port(),
    MQ_USERNAME: str(),
    MQ_SECRET: str(),
    FIREBASE_SERVICE_TYPE: str(),
    FIREBASE_PROJECT_ID: str(),
    FIREBASE_PRIVATEKEY_ID: str(),
    FIREBASE_PRIVATEKEY: str(),
    FIREBASE_CLIENT_EMAIL: str(),
    FIREBASE_CLIENT_ID: str(),
    FIREBASE_AUTH_URI: str(),
    FIREBASE_TOKEN_URI: str(),
    FIREBASE_PROVIDER_CERT: str(),
    FIREBASE_CLIENT_CERT: str(),
    FIREBASE_DOMAIN: str(),
  });
};

export default validateEnv;
