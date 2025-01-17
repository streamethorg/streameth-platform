import { fetchAllSessions } from '@/lib/services/sessionService';
import { fetchStage } from '@/lib/services/stageService';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import SessionSelector from './SessionSelector';
const TopBar = async ({
  stageId,
  organization,
  currentSessionId,
}: {
  stageId: string;
  organization: string;
  currentSessionId: string;
}) => {
  const stage = await fetchStage({ stage: stageId });
  if (!stage) return null;
  const allRecordings = await fetchAllSessions({
    stageId,
    type: SessionType.livestream,
  });
  const recordings = allRecordings.sessions;
  return (
    <SessionSelector
      recordings={recordings}
      currentSessionId={currentSessionId}
      stageName={stage?.name}
      organization={organization}
    />
  );
};

export default TopBar;
