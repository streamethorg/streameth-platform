import { VERSION } from "remotion/version";

/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */
export const REGION = "us-east-2";

export const SITE_NAME = 'rendering-engine';
export const RAM = 4096;
export const DISK = 10240;
export const TIMEOUT = 900;

export const WEBHOOK_URL = process.env.SERVER_WEBHOOK_URL;
export const WEBHOOK_SECRET = process.env.SERVER_WEBHOOK_SECRET_FILE;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID_FILE;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY_FILE;
