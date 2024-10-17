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
import { imageUploadAction } from '@/lib/actions/imageUpload';

function getImageData(file: File) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(file);
  return { files, displayUrl };
}

interface ConfirmImageDeletionProps {
  onDelete: () => void;
}

const ConfirmImageDeletion: React.FC<ConfirmImageDeletionProps> = ({
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
        <DialogTitle>Delete Image</DialogTitle>
        <p className="text-xl">Are you sure you want to delete this image?</p>
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

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  path: string;
  options: {
    maxSize?: number;
    placeholder?: string;
    aspectRatio?: number;
    requireExactSize?: { width: number; height: number };
    isProfileImage?: boolean;
    resize?: boolean;
    resizeDimensions?: { width: number; height: number };
    coverImage?: boolean;
  };
}

const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      path,
      className,
      options: {
        aspectRatio,
        requireExactSize,
        placeholder = 'preview',
        maxSize = 2000000,
        isProfileImage = false,
        resize = false,
        resizeDimensions,
        coverImage = false,
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

    const validateImage = useCallback(
      (file: File): Promise<boolean> => {
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
      },
      [requireExactSize]
    );

    const onSubmit = useCallback(
      async (file: File): Promise<string> => {
        if (!file) return '';

        try {
          let resizedFile = file;
          if (resize && resizeDimensions) {
            resizedFile = await resizeImage(file, {
              width: resizeDimensions.width,
              height: resizeDimensions.height,
              contentType: file.type,
              quality: 0.8,
              cover: coverImage,
            });
          }

          const data = new FormData();
          data.set(
            'file',
            new File(
              [resizedFile],
              resizedFile.name.replace(/[^a-zA-Z0-9.]/g, '_'),
              {
                type: resizedFile.type,
              }
            )
          );
          data.set('directory', path);
          const imageUrl = await imageUploadAction({ data });
          if (!imageUrl) throw new Error('Error uploading image');

          setPreview(imageUrl);
          return imageUrl;
        } catch (e) {
          console.error(e);
          setPreview('');
          throw e;
        } finally {
          setIsUploading(false);
        }
      },
      [path, resize, resizeDimensions, coverImage]
    );

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
          const file = resize
            ? await resizeImage(acceptedFiles[0], {
                width: resizeDimensions?.width ?? 1280,
                height: resizeDimensions?.height ?? 720,
                contentType: acceptedFiles[0].type,
                quality: 0.8,
              })
            : acceptedFiles[0];
          const { displayUrl } = getImageData(file);

          setPreview(displayUrl);
          toast.promise(
            onSubmit(file).then((uploadedPath) => {
              onChange?.({
                target: { name: props.name, value: uploadedPath },
              } as React.ChangeEvent<HTMLInputElement>);
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
      [onSubmit, resize, props.name]
    );

    const { getRootProps, getInputProps, inputRef } = useDropzone({
      accept: {
        'image/*': ['.png', '.jpg', '.gif'],
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

    const containerClasses = isProfileImage
      ? 'relative z-40 mx-4 mt-[-50px] flex h-24 w-24 rounded-full bg-white p-1'
      : `${className} relative w-full h-40`;

    const imageClasses = isProfileImage
      ? 'm-auto h-full w-full rounded-full bg-neutrals-300 text-white object-cover'
      : coverImage
        ? 'w-full h-full object-cover'
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
            <ConfirmImageDeletion onDelete={handleDelete} />
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

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
