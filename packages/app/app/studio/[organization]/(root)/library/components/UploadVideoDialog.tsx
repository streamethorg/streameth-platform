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
import { useState, useEffect, useCallback } from 'react';
import { LuFileUp } from 'react-icons/lu';
import Dropzone from './upload/Dropzone';
import UploadVideoForm from './upload/UploadVideoForm';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';
import FeatureButton from '@/components/ui/feature-button';

type UploadStatus = {
  progress: number;
  session: z.infer<typeof sessionSchema>;
  duration?: number;
};

export type Uploads = {
  [uploadId: string]: UploadStatus;
};

const UploadVideoDialog = ({ organizationId }: { organizationId: string }) => {
  const [open, setOpen] = useState(false);
  const [onEdit, setOnEdit] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Uploads>({});
  const [pendingUpdate, setPendingUpdate] = useState<{
    uploadId: string;
    updatedSession: z.infer<typeof sessionSchema>;
  } | null>(null);

  const handleSessionUpdate = useCallback(
    (uploadId: string, updatedSession: z.infer<typeof sessionSchema>) => {
      setPendingUpdate({ uploadId, updatedSession });
    },
    []
  );

  useEffect(() => {
    if (pendingUpdate) {
      const { uploadId, updatedSession } = pendingUpdate;
      setUploads((prevUploads) => ({
        ...prevUploads,
        [uploadId]: {
          ...prevUploads[uploadId],
          session: {
            ...prevUploads[uploadId].session,
            ...updatedSession,
          },
        },
      }));

      // updateSessionAction({ session: updatedSession as IExtendedSession })
      //   .then(() => {
      //     console.log('Session updated successfully');
      //   })
      //   .catch((error) => {
      //     console.error('Failed to update session:', error);
      //   });

      setOnEdit(null);
      setOpen(false);
      setPendingUpdate(null);
    }
  }, [pendingUpdate]);

  const dialogContent =
    onEdit && uploads[onEdit] ? (
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>Change details of the asset</DialogDescription>
        </DialogHeader>
        <Separator />
        <UploadVideoForm
          session={uploads[onEdit].session}
          onSessionUpdate={(updatedSession) =>
            handleSessionUpdate(onEdit, updatedSession)
          }
        />
      </DialogContent>
    ) : (
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Asset</DialogTitle>
          <DialogDescription>Upload a video to your library</DialogDescription>
        </DialogHeader>
        <Separator />
        <Dropzone
          setOnEdit={setOnEdit}
          setOpen={setOpen}
          uploads={uploads}
          setUploads={setUploads}
          organizationId={organizationId}
        />
      </DialogContent>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FeatureButton
          organizationId={organizationId}
          variant="ghost"
          className="flex items-center gap-2 h-10"
        >
          <LuFileUp className="w-5 h-5" />
          <span>Upload Video</span>
        </FeatureButton>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default UploadVideoDialog;
