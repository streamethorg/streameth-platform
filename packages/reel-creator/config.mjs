import { VERSION } from "remotion/version";
import * as fs from 'fs';

/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */

// Get secret value - supports both direct env vars (Coolify) and file-based secrets (Docker Swarm)
const getSecret = (directValue, filePath) => {
  // In development, return direct value or file path as-is
  if (process.env.NODE_ENV === 'development') {
    return directValue || filePath || undefined;
  }

  // Prefer direct environment variable (Coolify style)
  if (directValue) {
    return directValue;
  }

  // Fall back to file-based secret (Docker Swarm style)
  if (filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8').trim();
    } catch (error) {
      console.error(`Error reading secret file ${filePath}:`, error);
      return undefined;
    }
  }

  return undefined;
};

export const REGION = "us-east-2";

export const SITE_NAME = 'rendering-engine';
export const RAM = 4096;
export const DISK = 10240;
export const TIMEOUT = 900;

export const WEBHOOK_URL = process.env.SERVER_WEBHOOK_URL;
export const WEBHOOK_SECRET = getSecret(process.env.SERVER_WEBHOOK_SECRET, process.env.SERVER_WEBHOOK_SECRET_FILE);
export const AWS_ACCESS_KEY_ID = getSecret(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_ACCESS_KEY_ID_FILE);
export const AWS_SECRET_ACCESS_KEY = getSecret(process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_SECRET_ACCESS_KEY_FILE);
