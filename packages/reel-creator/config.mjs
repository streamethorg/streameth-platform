import { VERSION } from "remotion/version";

console.log('Raw environment variables in config.mjs:');
console.log('SERVER_WEBHOOK_URL:', process.env.SERVER_WEBHOOK_URL);
console.log('SERVER_WEBHOOK_SECRET_FILE:', process.env.SERVER_WEBHOOK_SECRET_FILE);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);

/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */

const readSecretFile = (path) => {
    if (process.env.NODE_ENV === 'development') {
      return path;
    }
    try {
      return fs.readFileSync(path, 'utf8').trim();
    } catch (error) {
      console.error(`Error reading secret file ${path}:`, error);
      throw error;
    }
  };

export const REGION = "us-east-2";

export const SITE_NAME = 'rendering-engine';
export const RAM = 4096;
export const DISK = 10240;
export const TIMEOUT = 900;

export const WEBHOOK_URL = process.env.SERVER_WEBHOOK_URL;
export const WEBHOOK_SECRET = readSecretFile(process.env.SERVER_WEBHOOK_SECRET_FILE);
export const AWS_ACCESS_KEY_ID = readSecretFile(process.env.AWS_ACCESS_KEY_ID_FILE);
export const AWS_SECRET_ACCESS_KEY = readSecretFile(process.env.AWS_SECRET_ACCESS_KEY_FILE);

