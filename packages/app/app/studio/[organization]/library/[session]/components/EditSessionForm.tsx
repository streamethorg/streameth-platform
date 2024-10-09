'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sessionSchema } from '@/lib/schema';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { IExtendedSession } from '@/lib/types';
import { updateSessionAction } from '@/lib/actions/sessions';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import DeleteAsset from '../../components/DeleteAsset';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/misc/form/imageUpload';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EditSessionForm = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession;
  organizationSlug: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      description: session.description,
      coverImage: session.coverImage,
      assetId: session.assetId,
      published: session.published,
    },
  });

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsLoading(true);

    updateSessionAction({
      session: {
        ...values,
        _id: session._id,
        organizationId: session.organizationId,
        eventId: session.eventId,
        stageId: session.stageId,
        start: session.start ?? Number(new Date()),
        end: session.end ?? Number(new Date()),
        speakers: session.speakers ?? [],
        type: session.type,
      },
    })
      .then(() => {
        toast.success('Session updated');
        form.reset(values); // Reset the form with the current values
      })
      .catch(() => toast.error('Error updating session'))
      .finally(() => {
        setIsLoading(false);
        router.refresh();
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Video title</FormLabel>
              <FormControl>
                <Input
                  className="bg-white rounded-md border border-gray-300"
                  placeholder="name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="h-50">
              <FormLabel required>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-white rounded-md border border-gray-300"
                  placeholder="description"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="w-[200px]">
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value === 'true')}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue
                      placeholder={field.value ? 'Public' : 'Private'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Public</SelectItem>
                    <SelectItem value="false">Private</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUpload
                  options={{
                    resize: true,
                    placeholder:
                      'Drag and drop your thumbnail to upload...Or just click here! Maximum image file size is 2MB. Best resolution is 1280 x 720. Aspect ratio of 16:9',
                    aspectRatio: 16 / 9,
                  }}
                  className="relative rounded-xl aspect-video max-w-[480px] bg-neutrals-300"
                  path={`sessions/${organizationSlug}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end items-end space-x-2">
          <DeleteAsset
            session={session}
            href={`/studio/${organizationSlug}/library`}
            TriggerComponent={
              <Button
                variant={'destructive-outline'}
                className="space-x-2 hover:bg-gray-100"
              >
                <Trash2 />
                <p>Delete video</p>
              </Button>
            }
          />
          <Button
            disabled={getFormSubmitStatus(form) || isLoading}
            type="submit"
            variant={'primary'}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Update details'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditSessionForm;
