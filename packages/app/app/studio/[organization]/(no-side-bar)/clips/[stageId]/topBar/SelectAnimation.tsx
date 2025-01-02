'use client';

import React, { useState } from 'react';
import { IExtendedSession } from '@/lib/types';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import Dropzone from '@/app/studio/[organization]/(root)/library/components/upload/Dropzone';
import { Uploads } from '@/app/studio/[organization]/(root)/library/components/UploadVideoDialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useClipContext } from '../ClipContext';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { clipSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combo-box';
import VideoUpload from '@/components/misc/form/videoUpload';

const SelectAnimation = ({
  animations,
  form,
  name,
  label,
  organizationId,
}: {
  animations: IExtendedSession[];
  form: UseFormReturn<z.infer<typeof clipSchema>>;
  name: 'introAnimation' | 'outroAnimation';
  label: string;
  organizationId: string;
}) => {
  const [upload, setUpload] = useState<Uploads>({});
  const { stageId } = useClipContext();

  const isAnimationUploading = () => {
    const uploadProgress = Object.values(upload).some(
      (upload) => upload.progress < 100
    );

    return uploadProgress;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <div className="flex flex-col gap-2 w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex flex-col space-y-2">
                <div className="max-w-[200px]">
                  <Combobox
                    items={[
                      ...animations.map((animation) => ({
                        label: animation.name,
                        value: animation._id,
                      })),
                    ]}
                    variant="outline"
                    value={field.value as string}
                    setValue={(value) => {
                      if (value) {
                        field.onChange(value);
                        // Clear uploads when an animation is selected
                        setUpload({});
                      }
                    }}
                    disabled={isAnimationUploading()}
                  />
                </div>

                {field.value ? ( // Check if an animation is selected
                  <div className="flex flex-col items-center justify-center gap-1 border-2 p-2 h-40 border-dashed rounded-md">
                    <span>
                      {animations.find((a) => a._id === field.value)?.name}
                    </span>
                    <Button
                      variant={'destructive'}
                      size={'sm'}
                      type="button"
                      onClick={() => {
                        field.onChange(''); // Clear the selection
                        setUpload({}); // Clear uploads
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  <VideoUpload
                  path={`organizations/${organizationId}/animations`}
                  options={{
                    placeholder: 'Upload animation video (max 15MB)',
                    maxSize: 15 * 1024 * 1024, // 15MB
                  }}
                  {...field}
                />
                )}
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectAnimation;
