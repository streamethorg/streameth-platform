import { config } from '@config';
import ClipEditor from '@models/clip.editor.model';
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
    const { data } = job.attrs.data;
    const result = await getClipEditorStatus(data);
    if (result.status) {
      const payload = {
        id: config.remotion.id,
        inputProps: {
          ...data.editorOptions,
          events: result.events
            .filter((e) => e.id && e.url)
            .map(({ status, ...rest }) => rest),
          captionLinesPerPage:
            data.editorOptions.captionLinesPerPage.toString(),
        },
      };
      const response = await fetch(
        `${config.remotion.host}/api/lambda/render`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );
      const res = await response.json();
      if (res.type === 'error') return;
      await ClipEditor.findByIdAndUpdate(data.clipEditorId, {
        renderId: res.data.renderId,
      });
      logger.info('Clip editor status job completed');
      job.remove();
    }
    if (!result.status) {
      await pulse.schedule(
        new Date(Date.now() + POLLING_INTERVAL),
        'clipEditorStatus',
        { data },
      );
      logger.info(`clipEditorStatus rescheduled`);
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