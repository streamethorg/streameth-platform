'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Combobox from '@/components/ui/combo-box';
import { useRouter } from 'next/navigation';
import { LuScissorsLineDashed } from 'react-icons/lu';
import { useClipPageContext } from '../ClipPageContext';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
interface Recording {
  label: string;
  value: string;
  url: string;
}

interface SessionSelectorProps {
  recordings: Recording[];
  currentSession: Recording;
  stageName: string;
}

const SessionSelector = ({
  recordings,
  currentSession,
  stageName,
}: SessionSelectorProps) => {
  const router = useRouter();
  const { organizationId } = useOrganizationContext();
  const { isCreatingClip, setIsCreatingClip } = useClipPageContext();
  const { isAddingOrEditingMarker, isImportingMarkers } = useMarkersContext();

  const isDisabled =
    isImportingMarkers || isCreatingClip || isAddingOrEditingMarker;

  return (
    <div className="p-2 flex w-full bg-white flex-row items-center">
      <Link
        href={`/studio/${organizationId}/library?clipable=true`}
        aria-label="Exit to library"
      >
        <Button variant="ghost" className="p-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
      </Link>
      <div className="flex flex-row items-center w-full">
        <p
          className="text-md uppercase font-light mr-4"
          aria-label={`Editing stage: ${stageName}`}
        >
          Editing: {stageName}
        </p>
        {recordings.length > 0 && (
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
        )}
      </div>
      <Button
        disabled={isDisabled}
        variant="primary"
        className="bg-blue-500 text-white"
        onClick={() => setIsCreatingClip(true)}
      >
        <LuScissorsLineDashed className="w-4 h-4 mr-1" />
        Create Clip
      </Button>
    </div>
  );
};

export default SessionSelector;
