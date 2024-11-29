import { config } from 'dotenv';
import { bool, cleanEnv, port, str, num } from 'envalid';
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
    MAGIC_LINK_SECRET: str(),
    MAGIC_LINK_EXPIRY: str(),
    LIVEPEER_BASE_URL: str(),
    LIVEPEER_API_KEY: str(),
    WALLET_ADDRESSES: str(),
    BUCKET_NAME: str(),
    BUCKET_URL: str(),
    SPACES_KEY: str(),
    SPACES_SECRET: str(),
    LIVEPEER_WEBHOOK_SECRET: str(),
    TELEGRAM_API_KEY: str(),
    TELEGRAM_CHAT_ID: str(),
    GOOGLE_OAUTH_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    TWITTER_OAUTH_SECRET: str(),
    TWITTER_CLIENT_ID: str(),
    THIRDWEB_SECRET_KEY: str(),
    MQ_HOST: str(),
    MQ_PORT: port(),
    MQ_USERNAME: str(),
    MQ_SECRET: str(),
    SERVICE_ACCOUNT_PRIVATE_KEY: str(),
    SERVICE_ACCOUNT_EMAIL: str(),
    MAIL_HOST: str(),
    MAIL_PORT: port(),
    MAIL_USER: str(),
    MAIL_PASS: str(),
    REMOTION_BASE_URL: str(),
    REMOTION_WEBHOOK_SECRET: str(),
    REMOTION_ID: str(),
    AWS_ACCESS_KEY_ID: str({
      desc: 'AWS Access Key ID for Remotion Lambda',
      default: process.env.REMOTION_AWS_ACCESS_KEY_ID // Fall back to REMOTION_ prefixed version
    }),
    AWS_SECRET_ACCESS_KEY: str({
      desc: 'AWS Secret Access Key for Remotion Lambda',
      default: process.env.REMOTION_AWS_SECRET_ACCESS_KEY // Fall back to REMOTION_ prefixed version
    }),
    AWS_REGION: str({
      desc: 'AWS Region for Remotion Lambda',
      default: 'us-east-1'
    }),
    REMOTION_DISK_SIZE_MB: num({
      desc: 'Disk size in MB for Remotion Lambda',
      default: 2048
    }),
    REMOTION_MEMORY_SIZE_MB: num({
      desc: 'Memory size in MB for Remotion Lambda',
      default: 2048
    }),
    REMOTION_TIMEOUT_SECONDS: num({
      desc: 'Timeout in seconds for Remotion Lambda',
      default: 120
    }),
    REMOTION_SITE_NAME: str({
      desc: 'Site name for Remotion renders',
      example: 'https://your-site.com'
    }),
    REMOTION_WEBHOOK_URL: str({
      desc: 'Webhook URL for Remotion render notifications'
    }),
  });
};

export default validateEnv;
