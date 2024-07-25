'use client';

import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { getImageUrl } from '@/lib/utils/utils';
import { toast } from 'sonner';
import { Label } from '@radix-ui/react-label';
import { Image as ImageLogo } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const dataTransfer = new DataTransfer();
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );
  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);
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
          className="absolute right-2 top-2 z-10 cursor-pointer rounded-full border border-muted-foreground bg-white text-muted-foreground"
        />
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center gap-5">
        <p className="text-xl">Are you sure you want to remove this image?</p>
        <DialogFooter className="flex items-center gap-4">
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChange(null);
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
  id?: string;
  maxSize?: number;
  placeholder?: string;
  aspectRatio: number;
  onChange: (files: string | null) => void;
  value: string | null | undefined;
  path: string;
  className?: string;
  requireExactSize?: { width: number; height: number };
  isProfileImage?: boolean;
}

export default function ImageUpload({
  id,
  placeholder,
  onChange,
  aspectRatio,
  value,
  path,
  className,
  maxSize = 5000000,
  requireExactSize,
  isProfileImage = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(
    value ? getImageUrl('/' + path + '/' + value) : ''
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsUploading(true);
    try {
      const isValidSize = await validateImage(file);
      if (!isValidSize) {
        throw new Error(error || 'Invalid image size');
      }

      if (file.size > maxSize) {
        throw new Error('File size is too big');
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
    } catch (e: any) {
      console.error(e);
      setPreview('');
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  const containerClasses = isProfileImage
    ? 'relative z-40 mx-4 mt-[-50px] flex h-24 w-24 rounded-full bg-white p-1'
    : `${className} relative w-full h-40`;

  const imageClasses = isProfileImage
    ? 'm-auto h-full w-full rounded-full bg-neutrals-300 text-white object-cover'
    : 'w-full h-full object-cover';

  const placeholderClasses = isProfileImage
    ? 'flex cursor-pointer flex-col items-center justify-center w-full h-full rounded-full border border-dotted bg-secondary'
    : 'flex cursor-pointer flex-col items-center justify-center w-full h-full border border-dotted bg-secondary';

  return (
    <div className={containerClasses}>
      {isUploading ? (
        <div className="flex h-full w-full items-center justify-center">
          Uploading image...
        </div>
      ) : preview ? (
        <div className="relative h-full w-full">
          <ConfirmImageDeletion onChange={onChange} setPreview={setPreview} />
          <Image src={preview} alt="preview" fill className={imageClasses} />
        </div>
      ) : (
        <Label htmlFor={id} className={placeholderClasses}>
          <div className="rounded-full bg-neutral-400 p-2 text-white">
            <ImageLogo />
          </div>
          {!isProfileImage && (
            <p className="w-full p-1 text-center text-[12px] lg:w-2/3">
              {placeholder}
            </p>
          )}
        </Label>
      )}
      <Input
        id={id}
        type="file"
        accept=".png,.jpg,.jpeg"
        placeholder="Upload image"
        className="hidden"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const { files, displayUrl } = getImageData(event);

          setPreview(displayUrl);
          toast.promise(
            onSubmit(files[0]).then((uploadedPath) => {
              onChange(uploadedPath);
              return 'Image uploaded successfully';
            }),
            {
              loading: 'Uploading image',
              success: (message) => {
                return message;
              },
              error: (error: Error) => {
                setPreview('');
                return error.message || 'Unknown error';
              },
            }
          );
        }}
      />
      {error && (
        <p className="absolute bottom-[-2rem] left-0 right-0 mt-2 text-center text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
