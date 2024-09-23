'use client';
import { Button } from '@/components/ui/button';
import { useClipContext } from '../ClipContext';
const TopBar = () => {
  const { setIsCreatingClip, isCreatingClip } = useClipContext();
  return (
    <div className="w-full bg-white p-4 flex justify-end">
      <Button
        disabled={isCreatingClip}
        variant={'primary'}
        className="bg-blue-500 text-white ml-auto"
        onClick={() => setIsCreatingClip(true)}
      >
        Create Clip
      </Button>
    </div>
  );
};

export default TopBar;
