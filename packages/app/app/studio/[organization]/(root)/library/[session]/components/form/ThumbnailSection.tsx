'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import ImageUpload from '@/components/misc/form/imageUpload';
import {
  generateThumbnailAction,
  updateSessionAction,
} from '@/lib/actions/sessions';
import { IExtendedSession } from '@/lib/types';
import { Loader2, Image } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';
import { createSessionUpdatePayload } from './utils';

interface ThumbnailSectionProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
  session: IExtendedSession;
  organizationSlug: string;
}

const ThumbnailSection = ({
  form,
  session,
  organizationSlug,
}: ThumbnailSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function generateThumbnail() {
    setIsLoading(true);
    console.log('🎯 Starting thumbnail generation:', {
      playbackId: session.playbackId,
      assetId: session.assetId,
    });

    generateThumbnailAction(session)
      .then((response) => {
        if (!response) {
          throw new Error('No response from thumbnail generation');
        }
        console.log('✅ Generated thumbnail URL:', response);

        // Handle different response formats from Livepeer
        let thumbnailUrl = response;
        if (
          typeof response === 'object' &&
          response.playbackInfo?.meta?.source
        ) {
          const thumbnailSource = response.playbackInfo.meta.source.find(
            (src: any) =>
              src.hrn === 'Thumbnail (PNG)' || src.type === 'image/png'
          );
          if (!thumbnailSource) {
            throw new Error('No thumbnail URL found in response');
          }
          thumbnailUrl = thumbnailSource.url;
        }

        // Update form state
        form.setValue('coverImage', thumbnailUrl);

        // Get current form values and merge with session data
        const currentValues = form.getValues();
        currentValues.coverImage = thumbnailUrl;

        // Automatically update session with new thumbnail
        return updateSessionAction(
          createSessionUpdatePayload(currentValues, session)
        );
      })
      .then(() => {
        toast.success('Thumbnail generated and saved');
        router.refresh();
      })
      .catch((error) => {
        console.error('❌ Error generating thumbnail:', error);
        toast.error(error?.message || 'Failed to generate thumbnail');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <FormField
      control={form.control}
      name="coverImage"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>Thumbnail</FormLabel>
            {!session.coverImage && session.type !== 'livestream' && (
              <Button
                onClick={generateThumbnail}
                disabled={isLoading}
                variant={'outline'}
                size="sm"
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" aria-label="Generate thumbnail" />
                    Generate thumbnail
                  </>
                )}
              </Button>
            )}
          </div>
          <FormControl>
            <ImageUpload
              options={{
                resize: true,
                placeholder:
                  'Drag and drop your thumbnail to upload...Or just click here! Maximum image file size is 2MB. Best resolution is 1280 x 720. Aspect ratio of 16:9',
                aspectRatio: 16 / 9,
                resizeDimensions: { width: 1280, height: 720 },
                coverImage: true,
              }}
              className="relative rounded-xl aspect-video max-w-[480px] bg-neutrals-300"
              path={`sessions/${organizationSlug}`}
              onDelete={async () => {
                setIsLoading(true);
                try {
                  const currentValues = form.getValues();
                  currentValues.coverImage = '';
                  await updateSessionAction(
                    createSessionUpdatePayload(currentValues, session)
                  );
                  toast.success('Thumbnail deleted');
                  router.refresh();
                } catch (error) {
                  toast.error('Error deleting thumbnail');
                } finally {
                  setIsLoading(false);
                }
              }}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ThumbnailSection;
