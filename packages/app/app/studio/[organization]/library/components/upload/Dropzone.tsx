'use client';

import { createSessionAction } from '@/lib/actions/sessions';
import * as z from 'zod';
import { useState, useCallback, forwardRef, useRef } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FileUp } from 'lucide-react';
import uploadVideo from '@/lib/uploadVideo';
import { getUrlAction } from '@/lib/actions/livepeer';
import { toast } from 'sonner';
import { sessionSchema } from '@/lib/schema';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { createStateAction } from '@/lib/actions/state';
import { StateType } from 'streameth-new-server/src/interfaces/state.interface';
import { Button } from '@/components/ui/button';

type UploadStatus = {
  progress: number;
  filename: string;
  assetId: string | null;
};

type Uploads = {
  [uploadId: string]: UploadStatus;
};

interface DropzoneProps {
  organizationId: string;
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>((props, ref) => {
  const { organizationId } = props;
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Uploads>({});
  const abortControllersRef = useRef<{ [uploadId: string]: AbortController }>(
    {}
  );

  const cancelUpload = useCallback(
    (uploadId: string, toastId: string | number) => {
      if (!abortControllersRef.current[uploadId]) {
        console.log('AbortController not found for uploadId:', uploadId);
        return;
      }
      abortControllersRef.current[uploadId].abort();

      const filename = uploads[uploadId]?.filename || 'Unknown file';
      toast.error(`Upload cancelled for ${filename}`, { id: toastId });

      setUploads((prev) => {
        const { [uploadId]: _, ...rest } = prev;
        return rest;
      });

      delete abortControllersRef.current[uploadId];
      toast.dismiss(toastId);
    },
    [uploads]
  );

  const finishUpload = useCallback(
    (values: z.infer<typeof sessionSchema>) => {
      createSessionAction({
        session: {
          ...values,
          coverImage: '',
          organizationId,
          speakers: [],
          start: 0,
          end: 0,
          type: SessionType.video,
          eventId: '',
          stageId: '',
        },
      })
        .then(async (session) => {
          await createStateAction({
            state: {
              sessionId: session._id,
              type: StateType.video,
              sessionSlug: session.slug,
              organizationId: session.organizationId,
            },
          });
        })
        .catch((e) => {
          console.log(e);
          toast.error('Error creating Session');
        });
    },
    [organizationId]
  );

  const startUpload = useCallback(
    async (file: File) => {
      const uploadId = Date.now().toString();
      abortControllersRef.current[uploadId] = new AbortController();

      setUploads((prev) => ({
        ...prev,
        [uploadId]: { progress: 0, filename: file.name, assetId: null },
      }));

      const toastId = toast.loading(`Preparing to upload ${file.name}...`);

      try {
        const uploadUrl = await getUrlAction(file.name);
        if (!uploadUrl) {
          throw new Error('Failed to get upload URL');
        }

        await new Promise<string>((resolve, reject) => {
          uploadVideo(
            file,
            uploadUrl.tusEndpoint as string,
            abortControllersRef.current[uploadId],
            (percentage) => {
              setUploads((prev) => ({
                ...prev,
                [uploadId]: { ...prev[uploadId], progress: percentage },
              }));
              toast.loading(
                `Uploading ${file.name} - ${Math.round(percentage)}%`,
                {
                  cancel: {
                    label: 'Cancel',
                    onClick: () => cancelUpload(uploadId, toastId),
                  },
                  id: toastId,
                }
              );
            },
            async () => {
              const assetId = uploadUrl.assetId as string;
              setUploads((prev) => ({
                ...prev,
                [uploadId]: { ...prev[uploadId], assetId },
              }));
              finishUpload({
                name: file.name,
                description: 'No description',
                assetId: assetId,
                published: false,
              });
              resolve(assetId);
            }
          );
        });

        toast.success(`${file.name} uploaded successfully`, { id: toastId });
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Upload was cancelled');
        } else {
          toast.error(
            error instanceof Error ? error.message : 'Upload failed',
            {
              id: toastId,
            }
          );
        }
      } finally {
        setUploads((prev) => {
          const { [uploadId]: _, ...rest } = prev;
          return rest;
        });
        delete abortControllersRef.current[uploadId];
      }
    },
    [cancelUpload, finishUpload]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => startUpload(file));
    },
    [startUpload]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const { code, message } = fileRejections[0].errors[0];
    if (code === 'file-too-large') {
      setError(`File is too large. Max size is 8GB.`);
    } else {
      setError(message);
    }

    setTimeout(() => {
      setError(null);
    }, 8000);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: 8 * 1024 * 1024 * 1024, // 8 GB in bytes
    maxFiles: 5,
    onDrop,
    onDropRejected,
  });

  return (
    <div
      ref={ref}
      {...getRootProps()}
      className="flex flex-col justify-center items-center space-y-2 w-full h-40 text-sm bg-white rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200"
    >
      <FileUp size={35} />
      <input {...getInputProps()} />

      {error ? (
        <div className="mx-4">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="mx-4">
          <p>Drag and drop videos to upload... Or just click here!</p>
          <p>
            Maximum video file size is 8GB. Best resolution of 1920 x 1080.
            Aspect ratio of 16:9
          </p>
        </div>
      )}
    </div>
  );
});

Dropzone.displayName = 'Dropzone';

export default Dropzone;
