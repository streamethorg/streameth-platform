'use client';

import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Image from 'next/image';
import { X, Image as ImageLogo } from 'lucide-react';
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
import { resizeImage } from '@/lib/utils/resizeImage';

function getImageData(file: File) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(file);
  return { files, displayUrl };
}

interface ConfirmImageDeletionProps {
  onChange: (files: string | null) => void;
  setPreview: React.Dispatch<React.SetStateAction<string>>;
}

const ConfirmImageDeletion: React.FC<ConfirmImageDeletionProps> = ({
  onChange,
  setPreview,
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
        <DialogTitle>Delete Image</DialogTitle>
        <p className="text-xl">Are you sure you want to delete this image?</p>
        <DialogFooter className="flex gap-4 items-center">
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChange('');
              setPreview('');
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

interface ImageUploadProps {
  options: {
    maxSize?: number;
    placeholder?: string;
    aspectRatio: number;
    requireExactSize?: { width: number; height: number };
    isProfileImage?: boolean;
  };
  onChange: (value: string) => void;
  value: string | undefined;
  path: string;
  className?: string;
}

export interface ImageUploadRef {
  reset: () => void;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  (
    {
      onChange,
      value,
      path,
      className,
      options: {
        aspectRatio,
        requireExactSize,
        placeholder = 'preview',
        maxSize = 2000000,
        isProfileImage = false,
      },
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string>(
      value ? getImageUrl('/' + path + '/' + value) : ''
    );
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setPreview('');
        onChange('');
        setError(null);
      },
    }));

    const validateImage = (file: File): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = document.createElement('img');
        img.onload = () => {
          if (requireExactSize) {
            if (
              img.width !== requireExactSize.width ||
              img.height !== requireExactSize.height
            ) {
              setError(
                `Image must be exactly ${requireExactSize.width}x${requireExactSize.height} pixels`
              );
              resolve(false);
            } else {
              setError(null);
              resolve(true);
            }
          } else {
            setError(null);
            resolve(true);
          }
        };
        img.src = URL.createObjectURL(file);
      });
    };

    const onSubmit = async (file: File): Promise<string> => {
      if (!file) return '';

      const isValidSize = await validateImage(file);
      if (!isValidSize) {
        throw new Error(error || 'Invalid image size');
      }

      const data = new FormData();
      data.set(
        'file',
        new File([file], file.name.replace(/[^a-zA-Z0-9.]/g, '_'), {
          type: file.type,
        })
      );
      data.set('path', path);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const uploadedPath = getImageUrl(
        '/' + path + '/' + file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      );
      setPreview(uploadedPath);

      return uploadedPath;
    };

    const onDropRejected = useCallback(
      (fileRejections: FileRejection[]) => {
        const { code, message } = fileRejections[0].errors[0];
        if (code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxSize / 1000000}MB.`);
        } else {
          setError(message);
        }
      },
      [maxSize]
    );

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          const processedFile = await resizeImage(acceptedFiles[0]);
          const { displayUrl } = getImageData(processedFile);

          setPreview(displayUrl);
          toast.promise(
            onSubmit(processedFile).then((uploadedPath) => {
              onChange(uploadedPath);
              setIsUploading(true);
              return 'Image uploaded successfully';
            }),
            {
              loading: 'Uploading image',
              success: (message) => {
                setIsUploading(false);
                return message;
              },
              error: (error: Error) => {
                onChange('');
                setPreview('');
                setIsUploading(false);
                return error.message || 'Unknown error';
              },
            }
          );
        }
      },
      [onChange]
    );

    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        'image/*': ['.png', '.jpg', '.gif'],
      },
      maxSize,
      maxFiles: 1,
      onDrop,
      onDropRejected,
    });

    const containerClasses = isProfileImage
      ? 'relative z-40 mx-4 mt-[-50px] flex h-24 w-24 rounded-full bg-white p-1'
      : `${className} relative w-full h-40`;

    const imageClasses = isProfileImage
      ? 'm-auto h-full w-full rounded-full bg-neutrals-300 text-white object-cover'
      : 'w-full h-full object-contain';

    const placeholderClasses = isProfileImage
      ? 'flex cursor-pointer flex-col items-center justify-center w-full h-full rounded-full border border-dotted bg-secondary'
      : 'flex cursor-pointer flex-col items-center justify-center w-full h-full border border-dotted bg-secondary';

    return (
      <div className={containerClasses}>
        {isUploading ? (
          <div className="flex justify-center items-center w-full h-full">
            Uploading image...
          </div>
        ) : preview ? (
          <div className="relative w-full h-full">
            <ConfirmImageDeletion
              onChange={() => {
                onChange('');
                setPreview('');
              }}
              setPreview={setPreview}
            />
            <Image src={preview} alt="preview" fill className={imageClasses} />
          </div>
        ) : (
          <div {...getRootProps()} className={placeholderClasses}>
            <div className="p-2 text-white rounded-full bg-neutral-400">
              <ImageLogo />
            </div>
            {!isProfileImage && (
              <p className="p-1 w-full text-center lg:w-2/3 text-[12px]">
                {placeholder}
              </p>
            )}
            <input {...getInputProps()} />
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

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
