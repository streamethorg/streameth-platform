'use client';

import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { X, Video as VideoLogo } from 'lucide-react';
import { getImageUrl } from '@/lib/utils/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDropzone, FileRejection } from 'react-dropzone';
import { videoUploadAction } from '@/lib/actions/videoUpload';
import { createSessionAction } from '@/lib/actions/sessions';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import {
  SessionType,
  eVisibilty,
} from 'streameth-new-server/src/interfaces/session.interface';

function getVideoData(file: File) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(file);
  return { files, displayUrl };
}

interface ConfirmVideoDeletionProps {
  onDelete: () => void;
}

const ConfirmVideoDeletion: React.FC<ConfirmVideoDeletionProps> = ({
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <X
          size={24}
          className="absolute top-2 right-2 z-10 bg-white rounded-md border cursor-pointer border-muted-foreground text-muted-foreground"
        />
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-5 justify-center items-center z-[99999999999]">
        <DialogTitle>Delete Video</DialogTitle>
        <p className="text-xl">Are you sure you want to delete this video?</p>
        <DialogFooter className="flex gap-4 items-center">
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface VideoUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  path: string;
  options: {
    maxSize?: number;
    placeholder?: string;
  };
}

const VideoUpload = forwardRef<HTMLInputElement, VideoUploadProps>(
  (
    {
      path,
      className,
      options: {
        placeholder = 'Click to upload video',
        maxSize = 20000000, // 20MB default
      },
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string>(
      value ? getImageUrl('/' + path + '/' + value) : ''
    );
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = useCallback(
      async (file: File): Promise<string> => {
        if (!file) return '';

        try {
          console.log('📦 Preparing animation video for upload:', file.name);
          const data = new FormData();
          data.set(
            'file',
            new File([file], file.name.replace(/[^a-zA-Z0-9.]/g, '_'), {
              type: file.type,
            })
          );
          data.set('directory', path);
          console.log('🚀 Starting animation upload to path:', path);
          const videoUrl = await videoUploadAction({ data });
          if (!videoUrl) throw new Error('Error uploading animation');

          console.log('✅ Animation upload successful! URL:', videoUrl);
          setPreview(videoUrl);

          // Create session for animation if path includes 'animations'
          const organizationId = path.split('/')[1]; // Extract org ID from path
          try {
            await createSessionAction({
              session: {
                name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                description: 'Animation video',
                type: SessionType.animation,
                organizationId,
                videoUrl: videoUrl,
                start: Date.now(),
                end: Date.now(),
                speakers: [],
                track: [],
                published: eVisibilty.private,
                assetId: '',
                processingStatus: ProcessingStatus.completed,
              },
            });
            console.log(
              '✅ Animation session created with videoUrl:',
              videoUrl
            );
            toast.success('Animation uploaded');
          } catch (error) {
            console.error('❌ Failed to create animation session:', error);
            toast.error('Failed to create animation session');
            // Continue even if session creation fails, as we still have the video URL
          }

          return videoUrl;
        } catch (e) {
          console.error('❌ Animation upload failed:', e);
          setPreview('');
          throw e;
        } finally {
          setIsUploading(false);
        }
      },
      [path]
    );

    const onDropRejected = useCallback(
      (fileRejections: FileRejection[]) => {
        const { code, message } = fileRejections[0].errors[0];
        console.log('⚠️ Animation file rejected:', { code, message });
        if (code === 'file-too-large') {
          setError(
            `Animation file is too large. Max size is ${maxSize / 1024 / 1024}MB.` // 20MB
          );
        } else {
          setError(message);
        }
      },
      [maxSize]
    );

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          console.log('🎬 Animation file dropped:', acceptedFiles[0].name);
          const file = acceptedFiles[0];
          const { displayUrl } = getVideoData(file);

          setPreview(displayUrl);
          setIsUploading(true);
          try {
            const uploadedPath = await onSubmit(file);
            onChange?.({
              target: { name: props.name, value: uploadedPath },
            } as React.ChangeEvent<HTMLInputElement>);
          } catch (error) {
            onChange?.({
              target: { name: props.name, value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
            setPreview('');
            toast.error(
              error instanceof Error ? error.message : 'Upload failed'
            );
          }
        }
      },
      [onSubmit, props.name, onChange]
    );

    const { getRootProps, getInputProps, inputRef } = useDropzone({
      accept: {
        'video/*': ['.mp4'],
      },
      maxSize,
      maxFiles: 1,
      onDrop,
      onDropRejected,
    });

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleDelete = useCallback(() => {
      onChange?.({
        target: { name: props.name, value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
      setPreview('');
    }, [onChange, props.name]);

    return (
      <div className={`${className} relative w-full h-40`}>
        {isUploading ? (
          <div className="flex justify-center items-center w-full h-full">
            Uploading animation...
          </div>
        ) : preview ? (
          <div className="relative w-full h-full">
            <ConfirmVideoDeletion onDelete={handleDelete} />
            <video
              src={preview}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="flex cursor-pointer flex-col items-center justify-center w-full h-full border border-dotted bg-secondary"
          >
            <div className="p-2 text-white rounded-full bg-neutral-400">
              <VideoLogo />
            </div>
            <p className="p-1 w-full text-center lg:w-2/3 text-[12px]">
              {placeholder}
            </p>
            <input {...getInputProps(props)} />
            {error && (
              <p className="absolute right-0 left-0 mt-2 text-sm text-center text-red-500 bottom-[-2rem]">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

VideoUpload.displayName = 'VideoUpload';

export default VideoUpload;
