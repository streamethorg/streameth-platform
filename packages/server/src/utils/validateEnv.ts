import { config } from 'dotenv';
import { bool, cleanEnv, port, str } from 'envalid';
config();

// Helper to make a field optional - at least one of the direct or _FILE version must be present
const optionalStr = str({ default: '' });

const validateEnv = () => {
  return cleanEnv(process.env, {
    // Non-secret config (always required)
    BASE_URL: str(),
    PLAYER_URL: str(),
    FRONTEND_URL: str(),
    NODE_ENV: str(),
    APP_PORT: port(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_NAME: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    CORS_ORIGIN: str(),
    CORS_CREDENTIALS: bool(),
    JWT_EXPIRY: str(),
    MAGIC_LINK_EXPIRY: str(),
    LIVEPEER_BASE_URL: str(),
    WALLET_ADDRESSES: str({ default: '' }),
    BUCKET_NAME: str(),
    BUCKET_URL: str(),
    REDIS_HOST: str(),
    REDIS_PORT: port(),
    MAIL_HOST: str(),
    MAIL_PORT: port(),
    REMOTION_BASE_URL: str(),
    REMOTION_ID: str(),

    // Secrets - support both direct (Coolify) and _FILE (Docker Swarm) patterns
    // At least one of each pair should be provided
    OPENAI_API_KEY: optionalStr,
    OPENAI_API_KEY_FILE: optionalStr,
    GEMINI_API_KEY: optionalStr,
    GEMINI_API_KEY_FILE: optionalStr,
    DB_PASSWORD: optionalStr,
    DB_PASSWORD_FILE: optionalStr,
    JWT_SECRET: optionalStr,
    JWT_SECRET_FILE: optionalStr,
    MAGIC_LINK_SECRET: optionalStr,
    MAGIC_LINK_SECRET_FILE: optionalStr,
    LIVEPEER_API_KEY: optionalStr,
    LIVEPEER_API_KEY_FILE: optionalStr,
    LIVEPEER_WEBHOOK_SECRET: optionalStr,
    LIVEPEER_WEBHOOK_SECRET_FILE: optionalStr,
    SPACES_KEY: optionalStr,
    SPACES_KEY_FILE: optionalStr,
    SPACES_SECRET: optionalStr,
    SPACES_SECRET_FILE: optionalStr,
    TELEGRAM_API_KEY: optionalStr,
    TELEGRAM_API_KEY_FILE: optionalStr,
    TELEGRAM_CHAT_ID: optionalStr,
    TELEGRAM_CHAT_ID_FILE: optionalStr,
    GOOGLE_OAUTH_SECRET: optionalStr,
    GOOGLE_OAUTH_SECRET_FILE: optionalStr,
    GOOGLE_CLIENT_ID: optionalStr,
    GOOGLE_CLIENT_ID_FILE: optionalStr,
    TWITTER_OAUTH_SECRET: optionalStr,
    TWITTER_OAUTH_SECRET_FILE: optionalStr,
    TWITTER_CLIENT_ID: optionalStr,
    TWITTER_CLIENT_ID_FILE: optionalStr,
    THIRDWEB_SECRET_KEY: optionalStr,
    THIRDWEB_SECRET_KEY_FILE: optionalStr,
    REDIS_PASSWORD: optionalStr,
    REDIS_PASSWORD_FILE: optionalStr,
    SERVICE_ACCOUNT_PRIVATE_KEY: optionalStr,
    SERVICE_ACCOUNT_PRIVATE_KEY_FILE: optionalStr,
    SERVICE_ACCOUNT_EMAIL: optionalStr,
    SERVICE_ACCOUNT_EMAIL_FILE: optionalStr,
    MAIL_USER: optionalStr,
    MAIL_USER_FILE: optionalStr,
    MAIL_PASS: optionalStr,
    MAIL_PASS_FILE: optionalStr,
    REMOTION_WEBHOOK_SECRET: optionalStr,
    REMOTION_WEBHOOK_SECRET_FILE: optionalStr,
    STRIPE_SECRET_KEY: optionalStr,
    STRIPE_SECRET_KEY_FILE: optionalStr,
    STRIPE_PUBLISHABLE_KEY: optionalStr,
    STRIPE_PUBLISHABLE_KEY_FILE: optionalStr,
  });
};

export default validateEnv;
