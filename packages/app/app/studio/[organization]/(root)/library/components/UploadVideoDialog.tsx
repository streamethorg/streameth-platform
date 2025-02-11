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
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import FeatureButton from '@/components/ui/feature-button';
import { FileUp } from 'lucide-react';

type UploadStatus = {
  progress: number;
  session: z.infer<typeof sessionSchema>;
  duration?: number;
};

export type Uploads = {
  [uploadId: string]: UploadStatus;
};

const UploadVideoDialog = () => {
  const { canUseFeatures, organizationId } = useOrganizationContext();

  const [open, setOpen] = useState(false);
  const [onEdit, setOnEdit] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Uploads>({});
  const [pendingUpdate, setPendingUpdate] = useState<{
    uploadId: string;
    updatedSession: z.infer<typeof sessionSchema>;
  } | null>(null);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!canUseFeatures) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/studio/${organizationId}/payments`);
      return;
    }
    setOpen(true);
  };

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

  if (!canUseFeatures) {
    return (
      <FeatureButton variant="outline" className="flex items-center gap-2">
        <FileUp className="w-5 h-5" />
        Upload Video
      </FeatureButton>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10"
          onClick={handleClick}
        >
          <LuFileUp className="w-5 h-5" />
          <span>Upload Video</span>
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default UploadVideoDialog;
