import { config } from '@config';
import Pulse from '@pulsecron/pulse';
import { logger } from './logger';

const pulse = new Pulse({
  db: { address: config.db.host, collection: 'agendajobs' },
  defaultConcurrency: 20,
  maxConcurrency: 30,
  resumeOnRestart: true,
});

pulse.on('complete', (job) => {
  logger.info('Job completed', job.attrs.name);
});

pulse.on('fail', (job) => {
  logger.warn('Job failed', job.attrs.name);
});

export default pulse;
