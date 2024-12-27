import { config } from 'dotenv';
import { bool, cleanEnv, port, str, num } from 'envalid';
config();

const validateEnv = () => {
  return cleanEnv(process.env, {
    OPENAI_API_KEY_FILE: str(),
    BASE_URL: str(),
    PLAYER_URL: str(),
    NODE_ENV: str(),
    APP_PORT: port(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_NAME: str(),
    DB_PASSWORD_FILE: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    CORS_ORIGIN: str(),
    CORS_CREDENTIALS: bool(),
    JWT_SECRET_FILE: str(),
    JWT_EXPIRY: str(),
    MAGIC_LINK_SECRET_FILE: str(),
    MAGIC_LINK_EXPIRY: str(),
    LIVEPEER_BASE_URL: str(),
    LIVEPEER_API_KEY_FILE: str(),
    WALLET_ADDRESSES: str(),
    BUCKET_NAME: str(),
    BUCKET_URL: str(),
    SPACES_KEY_FILE: str(),
    SPACES_SECRET_FILE: str(),
    LIVEPEER_WEBHOOK_SECRET_FILE: str(),
    TELEGRAM_API_KEY_FILE: str(),
    TELEGRAM_CHAT_ID_FILE: str(),
    GOOGLE_OAUTH_SECRET_FILE: str(),
    GOOGLE_CLIENT_ID_FILE: str(),
    TWITTER_OAUTH_SECRET_FILE: str(),
    TWITTER_CLIENT_ID_FILE: str(),
    THIRDWEB_SECRET_KEY_FILE: str(),
    REDIS_HOST: str(),
    REDIS_PORT: port(),
    REDIS_PASSWORD_FILE: str(),
    SERVICE_ACCOUNT_PRIVATE_KEY_FILE: str(),
    SERVICE_ACCOUNT_EMAIL_FILE: str(),
    MAIL_HOST: str(),
    MAIL_PORT: port(),
    MAIL_USER_FILE: str(),
    MAIL_PASS_FILE: str(),
    REMOTION_BASE_URL: str(),
    REMOTION_WEBHOOK_SECRET_FILE: str(),
    REMOTION_ID: str(),
  });
};

export default validateEnv;
