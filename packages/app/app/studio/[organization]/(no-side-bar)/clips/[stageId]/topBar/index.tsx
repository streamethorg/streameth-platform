import SessionSelector from './SessionSelector';
import { RecordingStatus } from 'livepeer/models/components';
import { IExtendedSession } from '@/lib/types';

interface SessionOption {
  label: string;
  value: string;
  url: string;
}

const TopBar = async ({
  stageRecordings,
  allSessions,
  name,
  organizationId,
  stageId,
  sessionId,
}: {
  stageRecordings: any[];
  allSessions: IExtendedSession[];
  name: string;
  organizationId: string;
  stageId: string;
  sessionId?: string;
}) => {

  const hasActiveLivestream =
    stageRecordings.length > 0 &&
    stageRecordings?.some(
      (recording) => recording.recordingStatus === RecordingStatus.Waiting
    );
  const sessionOptions: SessionOption[] = allSessions.map((session) => ({
    label: session.name,
    value: session._id,
    url: `/studio/${organizationId}/clips/${stageId}?sessionId=${session._id}&videoType=recording`,
  }));

  let currentSession: SessionOption;
  currentSession =
    sessionOptions.find((session) => session.value === sessionId) ||
    sessionOptions[0];

  if (!sessionId || hasActiveLivestream) {
    // Add live option when sessionId is provided
    const liveOption: SessionOption = {
      label: 'Live',
      value: stageId,
      url: `/studio/${organizationId}/clips/${stageId}?videoType=livestream`,
    };
    sessionOptions.push(liveOption);
    !sessionId && (currentSession = liveOption);
  }
  return (
    <SessionSelector
      recordings={sessionOptions}
      currentSession={currentSession}
      stageName={name}
    />
  );
};

export default TopBar;
