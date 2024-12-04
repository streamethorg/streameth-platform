import { Queue } from 'bull';
import { config } from '@config';
import { ClipEditorStatus } from '@interfaces/clip.editor.interface';
import ClipEditor from '@models/clip.editor.model';
import ClipEditorService from '@services/clipEditor.service';
import { logger } from '@utils/logger';
import { clipsQueue } from '@utils/redis';
// Create clip queue
const clipQueue = new Queue('clip-processing', {
  redis: config.redis, // Assuming you have redis config
});

// Process clip editor status jobs
clipQueue.process('clipEditorStatus', async (job) => {
  try {
    const { data } = job.data;
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
        status: ClipEditorStatus.rendering,
      });

      logger.info('Clip editor status job completed');
    } else {
      // Retry after 30 seconds if not ready
      await job.retry({ delay: 30000 });
      logger.info('clipEditorStatus rescheduled');
    }
  } catch (error) {
    logger.error('Error in clip editor status job:', error);
    throw error; // Let Bull handle the error
  }
});

// Process refetch assets jobs
clipQueue.process('refetchAssets', async (job) => {
  try {
    await refetchAssets();
    logger.info('Refetching assets completed');
  } catch (error) {
    logger.error('Error in refetch assets job:', error);
    throw error;
  }
});

// Schedule recurring refetch assets job
const scheduleRefetchAssets = async () => {
  await clipQueue.add(
    'refetchAssets',
    {},
    {
      repeat: {
        cron: '0 0 1 * *', // At 12:00 AM, on day 1 of the month
      },
    },
  );
  logger.info('Refetch assets job scheduled');
};

export async function startWorker() {
  try {
    await scheduleRefetchAssets();
  } catch (error) {
    logger.error('Error starting clip worker:', error);
  }
}
