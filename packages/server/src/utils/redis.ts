import { Redis } from 'ioredis';
import Queue from 'bull';
import { config } from '@config';
import { logger } from './logger';

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 5;

async function connectToRedis(retries = 0): Promise<Redis> {
  try {
    const redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    // Wait for ready event to ensure connection is established
    await new Promise((resolve, reject) => {
      redis.once('ready', resolve);
      redis.once('error', reject);
    });

    redis.on('error', (e) => {
      logger.error('🔴 Redis connection error:', {
        error: e.message,
        stack: e.stack,
        retries,
      });
      if (e.message !== 'Connection closed') {
        reconnectToRedis();
      }
    });

    redis.on('close', () => {
      logger.warn('🟡 Redis connection closed', {
        attempt: retries + 1,
        maxRetries: MAX_RETRIES,
      });
      reconnectToRedis();
    });

    logger.info('🟢 Redis connected successfully', {
      host: config.redis.host,
      port: config.redis.port,
    });
    return redis;
  } catch (e) {
    if (retries < MAX_RETRIES) {
      logger.warn('🟡 Redis connection failed', {
        error: e instanceof Error ? e.message : String(e),
        attempt: retries + 1,
        maxRetries: MAX_RETRIES,
        nextRetryIn: RETRY_INTERVAL / 1000,
      });
      return new Promise((resolve) => {
        setTimeout(() => resolve(connectToRedis(retries + 1)), RETRY_INTERVAL);
      });
    } else {
      logger.error('🔴 Redis connection failed permanently', {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
        totalAttempts: MAX_RETRIES,
      });
      throw new Error(
        `Failed to connect to Redis after ${MAX_RETRIES} retries: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}

async function reconnectToRedis() {
  logger.info(`🔄 Reconnecting to Redis in ${RETRY_INTERVAL / 1000} seconds...`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(connectToRedis()), RETRY_INTERVAL);
  });
}

async function monitorQueue(queue: Queue.Queue) {
  const counts = await queue.getJobCounts();
  console.log(`📊 Queue Status - ${queue.name}:`, {
    waiting: `⏳ ${counts.waiting}`,
    active: `🔄 ${counts.active}`,
    completed: `✅ ${counts.completed}`,
    failed: `❌ ${counts.failed}`,
    delayed: `⏰ ${counts.delayed}`
  });

  queue.on('completed', (job) => {
    console.log(`✅ Job completed in ${queue.name}:`, {
      jobId: job.id,
      timestamp: new Date().toISOString(),
    });
  });

  queue.on('failed', (job, err) => {
    console.error(`❌ Job failed in ${queue.name}:`, {
      jobId: job?.id,
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  });

  queue.on('stalled', (jobId) => {
    console.warn(`⚠️ Job stalled in ${queue.name}:`, {
      jobId,
      timestamp: new Date().toISOString(),
    });
  });

  queue.on('progress', (job, progress) => {
    console.log(`📈 Job progress in ${queue.name}:`, {
      jobId: job.id,
      progress,
      timestamp: new Date().toISOString(),
    });
  });
}

export async function createQueue(
  name: string,
  options: Queue.QueueOptions = {},
): Promise<Queue.Queue> {
  const connection = await connectToRedis();
  if (!connection) {
    throw new Error('Failed to establish Redis connection');
  }
  console.log('🔧 Creating queue', name);
  const queue = new Queue(name, {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    },
    ...options,
  });

  await monitorQueue(queue);
  return queue;
}

// Add queue instances at the top level
let _sessionTranscriptionsQueue: Queue.Queue | null = null;
let _stageTranscriptionsQueue: Queue.Queue | null = null;
let _videoUploadQueue: Queue.Queue | null = null;
let _clipsQueue: Queue.Queue | null = null;
let _videoImporterQueue: Queue.Queue | null = null;

export const sessionTranscriptionsQueue = async () => {
  if (!_sessionTranscriptionsQueue) {
    console.log('🎙️ Creating session transcriptions queue...');
    _sessionTranscriptionsQueue = await createQueue('session-transcriptions');
  }
  return _sessionTranscriptionsQueue;
};

export const stageTranscriptionsQueue = async () => {
  if (!_stageTranscriptionsQueue) {
    console.log('🎭 Creating stage transcriptions queue...');
    _stageTranscriptionsQueue = await createQueue('stage-transcriptions');
  }
  return _stageTranscriptionsQueue;
};

export const videoUploadQueue = async () => {
  if (!_videoUploadQueue) {
    console.log('🎥 Creating video upload queue...');
    _videoUploadQueue = await createQueue('video-upload');
  }
  return _videoUploadQueue;
};

export const clipsQueue = async () => {
  if (!_clipsQueue) {
    console.log('✂️ Creating clip queue...');
    _clipsQueue = await createQueue('clips');
  }
  return _clipsQueue;
};

export const videoImporterQueue = async () => {
  if (!_videoImporterQueue) {
    console.log('🎥 Creating video importer queue...');
    _videoImporterQueue = await createQueue('video-importer');
  }
  return _videoImporterQueue;
};

export const translationsQueue = async () => {
  console.log('🗣️ Creating translations queue...');
  return await createQueue('translations');
};

// Initialize the connection and export it
const connection = connectToRedis();
export default connection;
