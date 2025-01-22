'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Combobox from '@/components/ui/combo-box';
import { useRouter } from 'next/navigation';

interface Recording {
  label: string;
  value: string;
  url: string;
}

interface SessionSelectorProps {
  recordings: Recording[];
  currentSession: Recording;
  stageName: string;
  organization: string;
}

const SessionSelector = ({
  recordings,
  currentSession,
  stageName,
  organization,
}: SessionSelectorProps) => {
  const router = useRouter();

  if (!currentSession || !recordings.length) {
    return null;
  }

  return (
    <div className="p-2 flex w-full bg-white flex-row justify-between items-center">
      <div className="flex flex-row items-center w-full">
        <p
          className="text-md uppercase font-light mr-4"
          aria-label={`Editing stage: ${stageName}`}
        >
          Editing: {stageName}
        </p>
        <Combobox
          items={recordings}
          variant="outline"
          value={currentSession.value}
          setValue={(value) => {
            if (!value) return;
            const selectedRecording = recordings.find(
              (rec) => rec.value === value
            );
            if (selectedRecording) {
              router.push(selectedRecording.url);
            }
          }}
          aria-label="Select recording session"
        />
      </div>
      <Link
        href={`/studio/${organization}/library?clipable=true`}
        aria-label="Exit to library"
      >
        <Button variant="secondary" className="mb-2 px-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </Link>
    </div>
  );
};

export default SessionSelector;
