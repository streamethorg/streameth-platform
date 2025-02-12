'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IExtendedStage } from '@/lib/types';
import { toast } from 'sonner';
import { updateStageAction } from '@/lib/actions/stages';


const PublishLivestream = ({ stream }: { stream: IExtendedStage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handlePublishStream = async () => {
    setIsLoading(true);
    updateStageAction({
      stage: { ...stream, published: !stream.published },
    })
      .then((response) => {
        if (response) {
          setIsLoading(false);
          toast.success('Stream updated');
        } else {
          toast.error('Error publishing stream');
        }
      })
      .catch(() => {
        toast.error('Error publishing stream');
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-between space-x-2">
      {!stream?.published ? (
        <Button
          className="flex w-full flex-row justify-center text-xl text-white"
          loading={isLoading}
          onClick={handlePublishStream}
          disabled={stream?.published || isLoading}
          variant={'destructive'}
        >
          <span>Go live!</span>
        </Button>
      ) : (
        <Button
          className="text-md flex w-full flex-row justify-center bg-white"
          loading={isLoading}
          onClick={handlePublishStream}
          disabled={!stream?.published || isLoading}
          variant="destructiveOutline"
        >
          Unpublish
        </Button>
      )}
    </div>
  );
};

export default PublishLivestream;
