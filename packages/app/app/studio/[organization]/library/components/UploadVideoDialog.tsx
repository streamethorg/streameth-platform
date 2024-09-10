'use client';

import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { LuFileUp } from 'react-icons/lu';
import Dropzone from './upload/Dropzone';

const UploadVideoDialog = ({ organizationId }: { organizationId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex flex-row items-center p-2 pr-4 space-x-4 bg-white rounded-xl border w-fit hover:bg-secondary">
        <div className="p-4 text-white rounded-xl border bg-primary">
          <LuFileUp size={25} />
        </div>
        <span className="text-sm">Upload Video</span>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        <>
          <DialogHeader>
            <DialogTitle>Upload Asset</DialogTitle>
            <DialogDescription>
              Upload a video to your library
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <Dropzone setOpen={setOpen} organizationId={organizationId} />
        </>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoDialog;
