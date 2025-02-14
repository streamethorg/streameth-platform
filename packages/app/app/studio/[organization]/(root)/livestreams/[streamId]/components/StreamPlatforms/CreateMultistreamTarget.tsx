'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import StreamPlatformGrid from './StreamPlatforms';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import { TargetOutput } from 'streameth-new-server/src/interfaces/stage.interface';

export const CreateMultistreamTarget = ({
  streamId,
  btnName = 'Add',
  stageId,
  streamTargets,
}: {
  streamId: string;
  btnName?: string;
  stageId: string;
  streamTargets: TargetOutput[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outlinePrimary" className="space-x-1 mx-auto w-full">
          <Plus />
          <span className="">{btnName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white px-8 sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            Create multistream target
          </DialogTitle>
        </DialogHeader>
        <StreamPlatformGrid
          streamId={streamId}
          setIsOpen={setIsOpen}
          stageId={stageId}
          streamTargets={streamTargets}
        />
      </DialogContent>
    </Dialog>
  );
};
