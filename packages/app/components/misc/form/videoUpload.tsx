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
        maxSize = 15000000, // 15MB default
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
          setError(`Animation file is too large. Max size is ${maxSize / 1000000}MB.`);
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
          toast.promise(
            onSubmit(file).then((uploadedPath) => {
              onChange?.({
                target: { name: props.name, value: uploadedPath },
              } as React.ChangeEvent<HTMLInputElement>);
              setIsUploading(true);
              return 'Animation uploaded successfully';
            }),
            {
              loading: 'Uploading animation',
              success: (message) => {
                setIsUploading(false);
                return message;
              },
              error: (error: Error) => {
                onChange?.({
                  target: { name: props.name, value: '' },
                } as React.ChangeEvent<HTMLInputElement>);
                setPreview('');
                setIsUploading(false);
                return error.message || 'Unknown error';
              },
            }
          );
        }
      },
      [onSubmit, props.name]
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
