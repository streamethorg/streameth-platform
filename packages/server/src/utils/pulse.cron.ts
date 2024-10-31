import { config } from '@config';
import Pulse from '@pulsecron/pulse';

const pulse = new Pulse({
  db: { address: config.db.host, collection: 'agendajobs' },
  defaultConcurrency: 4,
  maxConcurrency: 4,
  processEvery: '10 seconds',
  resumeOnRestart: true,
});

export default pulse;
