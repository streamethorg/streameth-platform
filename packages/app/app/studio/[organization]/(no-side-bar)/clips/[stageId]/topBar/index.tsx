import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Combobox from '@/components/ui/combo-box';
import { fetchAllSessions } from '@/lib/services/sessionService';
import { redirect } from 'next/navigation';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
const TopBar = async ({
  stageId,
  organization,
  currentSessionId,
}: {
  stageId: string;
  organization: string;
  currentSessionId: string;
}) => {
  const allRecordings = await fetchAllSessions({
    stageId,
    type: SessionType.livestream,
  });
  const recordings = allRecordings.sessions;
  const currentSession = recordings.find(
    (recording) => recording._id === currentSessionId
  );
  return (
    <div className="p-2 flex  w-full bg-white flex-row justify-between items-center">
      <Combobox
        items={recordings.map((recording) => ({
          label: recording.name,
          value: recording._id,
        }))}
        variant="outline"
        value={currentSession._id}
        setValue={(value) => {
          if (value) {
            redirect(`/studio/${organization}/clips/${value}`);
          }
        }}
      />
      <Link href={`/studio/${organization}/library?clipable=true`}>
        <Button variant="ghost" className="mb-2 px-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to library
        </Button>
      </Link>
    </div>
  );
};

export default TopBar;

