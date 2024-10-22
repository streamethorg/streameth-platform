import { getClipEditorStatus, refetchAssets } from './livepeer';
import { logger } from './logger';
import pulse from './pulse.cron';

export enum AgendaJobs {
  REFETCH_ASSETS = 'refetch assets',
  CLIP_EDITOR_STATUS = 'clipEditorStatus',
}

const POLLING_INTERVAL = 60000; // 1 minute
pulse.define(AgendaJobs.REFETCH_ASSETS, async (job) => {
  try {
    await refetchAssets();
    logger.info('Refetching assets completed');
  } catch (error) {
    logger.error('Error in refetch assets job:', error);
  }
});

pulse.define(AgendaJobs.CLIP_EDITOR_STATUS, async (job) => {
  try {
    const { data, attempts } = job.attrs.data;
    const result = await getClipEditorStatus(data);
    if (result) {
      logger.info('Clip editor status job completed');
      job.remove();
      return;
    }
    if (job.attrs.attempts < attempts) {
      await pulse.schedule(
        new Date(Date.now() + POLLING_INTERVAL),
        'clipEditorStatus',
        { data },
      );
      logger.info(
        `clipEditorStatus rescheduled. Attempt: ${job.attrs.attempts + 1}`,
      );
    } else {
      logger.warn(`clipEditorStatus max attempts reached. Stopping polling.`);
    }
  } catch (error) {
    logger.error('Error in clip editor status job:', error);
  }
});

export async function jobs() {
  try {
    await pulse.start();
    //At 12:00 AM, on day 1 of the month
    await pulse.every('0 0 1 * *', AgendaJobs.REFETCH_ASSETS);
    logger.info('Refetch assets job scheduled');
  } catch (error) {
    logger.error('Error in JobWorker:', error);
  }
}
