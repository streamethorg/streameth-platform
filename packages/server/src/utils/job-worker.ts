import { config } from '@config';
import { ProcessingStatus, SessionType } from '@interfaces/session.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import ClipEditor from '@models/clip.editor.model';
import SessionService from '@services/session.service';
import StateService from '@services/state.service';
import { getClipEditorStatus, refetchAssets } from './livepeer';
import { logger } from './logger';
import pulse from './pulse.cron';

const sessionService = new SessionService();
const stateService = new StateService();

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

const createClipSession = async (clipEditorId: string, renderId: string) => {
  const clipEditor = await ClipEditor.findById(clipEditorId);
  if (!clipEditor) return;
  const event = clipEditor.events?.find((e) => e.label === 'main');
  if (!event?.sessionId) return;
  const session = await sessionService.findOne({
    _id: event.sessionId,
  });
  if (!session) return;
  const createSession = await sessionService.create({
    name: session.name,
    description: session.description,
    assetId: '',
    start: session.start,
    end: session.end,
    organizationId: session.organizationId,
    stageId: session.stageId,
    type: SessionType.clip,
    processingStatus: ProcessingStatus.rendering,
  });
  await clipEditor.updateOne({
    renderId,
    clipSessionId: createSession._id,
  });
  await stateService.create({
    organizationId: createSession.organizationId,
    sessionId: createSession._id.toString(),
    type: StateType.clip,
    status: StateStatus.pending,
  });
};

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
      await createClipSession(data.clipEditorId, res.data.renderId);
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
