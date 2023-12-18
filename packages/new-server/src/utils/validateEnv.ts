import { bool, cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';
// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();

const validateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DB_HOST: str(),
    DB_PORT: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    ORIGIN: str(),
    CREDENTIALS: bool(),
    SECRET_KEY: str(),
  });
};

export default validateEnv;
