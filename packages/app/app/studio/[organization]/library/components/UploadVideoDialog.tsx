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
import { updateSessionAction } from '@/lib/actions/sessions';
import { IExtendedSession } from '@/lib/types';

type UploadStatus = {
  progress: number;
  session: z.infer<typeof sessionSchema>;
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

      updateSessionAction({ session: updatedSession as IExtendedSession })
        .then(() => {
          console.log('Session updated successfully');
        })
        .catch((error) => {
          console.error('Failed to update session:', error);
        });

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
      <DialogTrigger className="flex flex-row items-center p-2 pr-4 space-x-4 bg-white rounded-xl border w-fit hover:bg-secondary">
        <div className="p-4 text-white rounded-xl border bg-primary">
          <LuFileUp size={25} />
        </div>
        <span className="text-sm">Upload Video</span>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default UploadVideoDialog;
