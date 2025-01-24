import { fetchAllSessions } from '@/lib/services/sessionService';
import { fetchStage, fetchStageRecordings } from '@/lib/services/stageService';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import SessionSelector from './SessionSelector';
import { RecordingStatus } from 'livepeer/models/components';

interface SessionOption {
  label: string;
  value: string;
  url: string;
}

const TopBar = async ({
  stageId,
  organization,
  sessionId,
}: {
  stageId: string;
  organization: string;
  sessionId?: string;
}) => {
  const [allSessions, stage] = await Promise.all([
    fetchAllSessions({
      stageId,
      type: SessionType.livestream,
    }),
    fetchStage({ stage: stageId }),
  ]);

  const stageRecordings = await fetchStageRecordings({
    streamId: stage?.streamSettings?.streamId || '',
  });

  const hasActiveLivestream =
    stageRecordings.length > 0 &&
    stageRecordings?.some(
      (recording) => recording.recordingStatus === RecordingStatus.Waiting
    );
  const sessionOptions: SessionOption[] = allSessions.sessions.map(
    (session) => ({
      label: session.name,
      value: session._id,
      url: `/studio/${organization}/clips/${stageId}?sessionId=${session._id}&videoType=recording`,
    })
  );

  let currentSession: SessionOption;
  currentSession =
    sessionOptions.find((session) => session.value === sessionId) ||
    sessionOptions[0];

  if (!sessionId || hasActiveLivestream) {
    // Add live option when sessionId is provided
    const liveOption: SessionOption = {
      label: 'Live',
      value: stageId,
      url: `/studio/${organization}/clips/${stageId}?videoType=livestream`,
    };
    sessionOptions.push(liveOption);
    !sessionId && (currentSession = liveOption);
  }
  return (
    <SessionSelector
      recordings={sessionOptions}
      currentSession={currentSession}
      stageName={stage?.name || ''}
      organization={organization}
    />
  );
};

export default TopBar;
