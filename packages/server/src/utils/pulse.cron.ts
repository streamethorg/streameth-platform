import { config } from '@config';
import Pulse from '@pulsecron/pulse';
import { logger } from './logger';
import { dbConnection } from '@databases/index';
const pulse = new Pulse({
  db: { address: dbConnection.url, collection: 'agendajobs' },
  defaultConcurrency: 20,
  maxConcurrency: 40,
  resumeOnRestart: true,
});

pulse.on('fail', (job) => {
  logger.warn('Job failed', job.attrs.name);
});

export default pulse;
