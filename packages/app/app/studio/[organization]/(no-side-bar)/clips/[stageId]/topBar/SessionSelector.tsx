'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Combobox from '@/components/ui/combo-box';
import { useRouter } from 'next/navigation';
import { IExtendedSession } from '@/lib/types';

const SessionSelector = ({
  recordings,
  currentSessionId,
  stageName,
  organization,
}: {
  recordings: IExtendedSession[];
  currentSessionId: string;
  stageName: string;
  organization: string;
}) => {
  const router = useRouter();
  const currentSession = recordings.find(
    (recording) => recording._id === currentSessionId
  );
  if (!currentSession) return null;
  return (
    <div className="p-2 flex w-full bg-white flex-row justify-between items-center">
      <div className="flex flex-row items-center w-full">
        <p className="text-md uppercase font-light mr-4">Editing {stageName}</p>
        <Combobox
          items={recordings.map((recording, index) => ({
            label: `Recording ${index + 1}`,
            value: recording._id,
          }))}
          variant="outline"
          value={currentSession._id}
          setValue={(value) => {
            if (value) {
              router.push(
                `/studio/${organization}/clips/${currentSession.stageId}?sessionId=${value}&videoType=recording`
              );
            }
          }}
        />
      </div>
      <Link href={`/studio/${organization}/library?clipable=true`}>
        <Button variant="ghost" className="mb-2 px-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to library
        </Button>
      </Link>
    </div>
  );
};

export default SessionSelector;
