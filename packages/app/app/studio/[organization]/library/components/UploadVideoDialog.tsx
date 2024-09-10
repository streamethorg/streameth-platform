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
import { Button } from '@/components/ui/button';
import UploadVideoForm from './upload/UploadVideoForm';
import { useRef, useState } from 'react';
import UploadComplete from '@/lib/svg/UploadComplete';
import { useRouter } from 'next/navigation';
import { LuFileUp } from 'react-icons/lu';
import Dropzone from './upload/Dropzone';

const UploadVideoDialog = ({ organizationId }: { organizationId: string }) => {
  const [open, setOpen] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const router = useRouter();
  const abortControllerRef = useRef(new AbortController());

  const handleCancel = () => {
    abortControllerRef.current.abort();
  };

  const onFinish = () => {
    setIsUploaded(true);

    setTimeout(() => {
      setIsUploaded(false);
    }, 10000);
  };

  const handleUploadComplete = (assetId: string) => {
    console.log('Upload completed with asset ID:', assetId);
    // Do something with the asset ID
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex flex-row items-center p-2 pr-4 space-x-4 bg-white rounded-xl border w-fit hover:bg-secondary">
        <div className="p-4 text-white rounded-xl border bg-primary">
          <LuFileUp size={25} />
        </div>
        <span className="text-sm">Upload Video</span>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        {isUploaded ? (
          <>
            <DialogHeader className="p-10 space-y-4">
              <div className="p-4 mx-auto">
                <UploadComplete />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <DialogTitle>Video uploaded succesfully! 🎉</DialogTitle>
                <DialogDescription>
                  Your video is currently being processed. This could take
                  several minutes.
                </DialogDescription>
              </div>
            </DialogHeader>
            <Button
              variant={'secondary'}
              className="mx-auto w-1/3 border-2"
              onClick={() => router.refresh()}
            >
              Go back to Assets
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upload Asset</DialogTitle>
              <DialogDescription>
                Upload a video to your library
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <Dropzone
              organizationId={organizationId}
              onUploadComplete={handleUploadComplete}
              abortControllerRef={abortControllerRef}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoDialog;
