import { Redis } from 'ioredis';
import Queue from 'bull';
import { config } from '../config';
import { logger } from './logger';

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 5;

async function connectToRedis(retries = 0): Promise<Redis> {
  try {
    const redis = new Redis({
      host: config.redis.host,
      port: parseInt(config.redis.port),
      password: config.redis.password,
    });

    // Wait for ready event to ensure connection is established
    await new Promise((resolve, reject) => {
      redis.once('ready', resolve);
      redis.once('error', reject);
    });

    redis.on('error', (e) => {
      logger.error('Redis connection error:', e);
      if (e.message !== 'Connection closed') {
        reconnectToRedis();
      }
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
      reconnectToRedis();
    });

    logger.info('Redis connected');
    return redis;
  } catch (e) {
    if (retries < MAX_RETRIES) {
      logger.warn(
        `Redis connection failed. Retrying in ${RETRY_INTERVAL / 1000} seconds...`,
      );
      return new Promise((resolve) => {
        setTimeout(() => resolve(connectToRedis(retries + 1)), RETRY_INTERVAL);
      });
    } else {
      logger.error('Max retries reached. Could not connect to Redis:', e);
      throw new Error('Failed to connect to Redis after max retries');
    }
  }
}

async function reconnectToRedis() {
  logger.info(`Reconnecting to Redis in ${RETRY_INTERVAL / 1000} seconds...`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(connectToRedis()), RETRY_INTERVAL);
  });
}

export async function createQueue(name: string, options: Queue.QueueOptions = {}): Promise<Queue.Queue> {
  const connection = await connectToRedis();
  if (!connection) {
    throw new Error('Failed to establish Redis connection');
  }
  return new Queue(name, {
    redis: {
      host: config.redis.host,
      port: parseInt(config.redis.port),
      password: config.redis.password,
    },
    ...options,
  });
}

export const sessionTranscriptionsQueue = createQueue('session-transcriptions');
export const stageTranscriptionsQueue = createQueue('stage-transcriptions');
export const videoUploadQueue = createQueue('video-upload');
// Initialize the connection and export it
const connection = connectToRedis();
export default connection;
