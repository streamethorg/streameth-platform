'use client';

import { updateStageAction } from '@/lib/actions/stages';
import { IExtendedStage } from '@/lib/types';
import { Earth, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const LivestreamVisibility = ({ stream }: { stream: IExtendedStage }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVisibility = async () => {
    setIsLoading(true);
    try {
      const response = await updateStageAction({
        stage: { ...stream, published: !stream.published },
      });

      if (response) {
        toast.success('Stream visibility updated');
      } else {
        toast.error('Failed to update stream visibility');
      }
    } catch (error) {
      toast.error('Failed to update stream visibility');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Button
        variant="ghost"
        onClick={handleToggleVisibility}
        disabled={isLoading}
        className="flex gap-2 justify-start items-center w-full hover:bg-gray-100"
      >
        {!stream.published ? (
          <>
            <Earth className="w-4 h-4" />
            <span className="text-sm">Make Public</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span className="text-sm">Make Private</span>
          </>
        )}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      </Button>
    </div>
  );
};

export default LivestreamVisibility;
