import { VERSION } from "remotion/version";

/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */
export const REGION = "us-east-2";

export const SITE_NAME = "rendering-engine";
export const RAM = 4096;
export const DISK = 10240;
export const TIMEOUT = 900;

export const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-other-project-url.com/api/remotion-webhook';
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key';
