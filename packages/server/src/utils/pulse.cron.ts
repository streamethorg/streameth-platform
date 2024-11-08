import { config } from '@config';
import Pulse from '@pulsecron/pulse';
import { logger } from './logger';

const pulse = new Pulse({
  db: { address: config.db.host, collection: 'agendajobs' },
  defaultConcurrency: 20,
  maxConcurrency: 40,
  resumeOnRestart: true,
});

pulse.on('fail', (job) => {
  logger.warn('Job failed', job.attrs.name);
});

export default pulse;
