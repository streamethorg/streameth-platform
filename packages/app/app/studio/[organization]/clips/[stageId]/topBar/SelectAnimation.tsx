'use client';

import React, { useState } from 'react';
import { IExtendedSession } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { Uploads } from '../../../library/components/UploadVideoDialog';
import Dropzone from '../../../library/components/upload/Dropzone';
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
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                      // Clear uploads when an animation is selected
                      setUpload({});
                    }
                  }}
                  disabled={isAnimationUploading()}
                >
                  <SelectTrigger className="rounded-lg border bg-white">
                    <SelectValue placeholder="select animation"></SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
                    {animations.map((animation) => (
                      <SelectItem key={animation._id} value={animation._id}>
                        {animation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.value ? ( // Check if an animation is selected
                  <div className="flex flex-col items-center justify-center gap-1 border-2 p-2 h-40 border-dashed rounded-md">
                    <span>
                      {
                        animations.find((anim) => anim._id === field.value)
                          ?.name
                      }
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
                  <Dropzone
                    uploads={upload}
                    setUploads={setUpload}
                    organizationId={organizationId}
                    stageId={stageId}
                    onChange={field.onChange}
                    type={SessionType.animation}
                    maxFiles={1}
                    maxSize={50 * 1024 * 1024}
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
