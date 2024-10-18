'use client';

import Image from 'next/image';
import { ImageUp, X } from 'lucide-react';
import { getImageUrl } from '@/lib/utils/utils';
import { toast } from 'sonner';
import { useCallback, useState, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { resizeImage } from '@/lib/utils/resizeImage';
import { imageUploadAction } from '@/lib/actions/imageUpload';

interface ImageDropzoneProps {
  id?: string;
  placeholder?: string;
  onChange: (file: string | null) => void;
  value: string | null | undefined;
  path: string;
}

function getImageData(file: File) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(file);
  return { files, displayUrl };
}

const ImageDropzone = forwardRef<HTMLDivElement, ImageDropzoneProps>(
  (props, ref) => {
    const { onChange, value, path, ...rest } = props;
    const [preview, setPreview] = useState(
      value ? getImageUrl('/' + path + '/' + value) : ''
    );
    const [isUploading, setIsUploading] = useState(false);

    const onSubmit = useCallback(
      async (file: File) => {
        if (!file) return;
        setIsUploading(true);
        try {
          const data = new FormData();
          data.set('file', file);
          data.set('directory', path);
          const imageUrl = await imageUploadAction({ data });
          if (!imageUrl) {
            throw new Error('Error uploading image');
          }
          onChange(imageUrl);
          toast.success('Image uploaded successfully');
        } catch (e) {
          console.error(e);
          toast.error('Error uploading image');
        }
        setIsUploading(false);
      },
      [onChange, path]
    );

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          const processedFile = await resizeImage(acceptedFiles[0], {
            width: 1500,
            height: 500,
            quality: 0.8,
            cover: true,
            contentType: 'image/jpeg',
          });
          const { displayUrl } = getImageData(processedFile);

          setPreview(displayUrl);
          onSubmit(processedFile);
        }
      },
      [onSubmit]
    );

    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        'image/*': ['.png', '.jpg', '.gif'],
      },
      maxSize: 2 * 1024 * 1024, // 2 MB
      maxFiles: 1,
      onDrop,
    });

    return (
      <div ref={ref} {...rest}>
        {isUploading ? (
          <div className="flex z-10 justify-center items-center h-40 bg-white border-2 border-gray-300 border-dashed transition">
            <div className="text-sm">Uploading image...</div>
          </div>
        ) : preview ? (
          <div className="relative">
            <X
              size={24}
              className="absolute top-2 right-2 z-20 rounded-md cursor-pointer hover:bg-gray-300"
              onClick={() => {
                onChange(null);
                setPreview('');
              }}
            />
            <div className="flex justify-center w-full h-40 bg-white border-2 border-gray-300 border-dashed">
              <Image
                src={preview ?? value}
                alt="preview"
                className="object-contain w-[50%]"
                quality={40}
                width={1280}
                height={720}
              />
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="flex z-10 flex-col justify-center items-center space-y-4 h-40 text-sm bg-white rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200"
          >
            <ImageUp size={35} />
            <input {...getInputProps()} />
            <div className="mx-4">
              <p>
                Drag and drop your thumbnail to upload... Or just click here!
              </p>
              <p>
                Maximum image file size is 2MB. Best resolution is 1280 x 720.
                Aspect ratio of 16:9
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ImageDropzone.displayName = 'ImageDropzone';

export default ImageDropzone;
