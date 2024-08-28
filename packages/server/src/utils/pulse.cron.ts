import { config } from '@config';
import Pulse from '@pulsecron/pulse';
import { refetchAssets } from './livepeer';
import { logger } from './logger';

const pulse = new Pulse({
  db: { address: config.db.host, collection: 'agendajobs' },
  defaultConcurrency: 4,
  maxConcurrency: 4,
  processEvery: '10 seconds',
  resumeOnRestart: true,
});

pulse.define('refetch assets', async (job) => {
  try {
    await refetchAssets();
    logger.info('Refetching assets completed');
  } catch (error) {
    logger.error('Error in refetch assets job:', error);
  }
});

export async function jobs() {
  try {
    await pulse.start();
    //At 12:00 AM, on day 1 of the month
    await pulse.every('0 0 1 * *', 'refetch assets');
    logger.info('Refetch assets job scheduled');
  } catch (error) {
    logger.error('Error in JobWorker:', error);
  }
}
