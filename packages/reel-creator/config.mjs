import { VERSION } from "remotion/version";

/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */

const readSecretFile = async (path) => {
  // During build time or when path is undefined, return the path itself
  if (!path || process.env.NODE_ENV === 'development') {
    return path;
  }

  // Only import fs when we actually need to read files
  // This prevents issues during build time
  const fs = await import('fs').then(m => m.default).catch(() => null);
  
  if (!fs) {
    console.warn('File system module not available, returning path as is');
    return path;
  }

  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (error) {
    console.error(`Error reading secret file ${path}:`, error);
    return path; // Return path instead of throwing during build
  }
};

export const REGION = "us-east-2";

export const SITE_NAME = 'rendering-engine';
export const RAM = 4096;
export const DISK = 10240;
export const TIMEOUT = 900;

export const SERVER_WEBHOOK_URL = process.env.SERVER_WEBHOOK_URL;
export const SERVER_WEBHOOK_SECRET_FILE = readSecretFile(process.env.SERVER_WEBHOOK_SECRET_FILE);
export const AWS_ACCESS_KEY_ID_FILE = readSecretFile(process.env.AWS_ACCESS_KEY_ID_FILE);
export const AWS_SECRET_ACCESS_KEY_FILE = readSecretFile(process.env.AWS_SECRET_ACCESS_KEY_FILE);