'use client';
import { Button } from '@/components/ui/button';
import { useClipContext } from '../ClipContext';
import { IExtendedSession } from '@/lib/types';

const TopBar = () => {
  const {
    setIsCreatingClip,
    isCreatingClip,
    isImportingMarkers,
    setIsImportingMarkers,
    isAddingOrEditingMarker,
  } = useClipContext();

  const isDisabled =
    isImportingMarkers || isCreatingClip || isAddingOrEditingMarker;

  return (
    <div className="flex xl:hidden  w-full bg-white p-4 justify-end gap-4">
      <Button
        disabled={isDisabled}
        variant={'outline'}
        onClick={() => setIsImportingMarkers(true)}
      >
        Import Markers
      </Button>
      <Button
        disabled={isDisabled}
        variant={'primary'}
        className="bg-blue-500 text-white"
        onClick={() => setIsCreatingClip(true)}
      >
        Create Clip
      </Button>
    </div>
  );
};

export default TopBar;
