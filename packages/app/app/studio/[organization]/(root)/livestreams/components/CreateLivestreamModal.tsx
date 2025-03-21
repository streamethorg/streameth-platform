'use client';

import DatePicker from '@/components/misc/form/datePicker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createStageAction } from '@/lib/actions/stages';
import { StageSchema } from '@/lib/schema';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CreateLivestreamOptions from './CreateLivestreamOptions';
import TimePicker from '@/components/misc/form/timePicker';
import { formatDate } from '@/lib/utils/time';
import ImageUpload from '@/components/misc/form/imageUpload';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LuRadio } from 'react-icons/lu';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { Radio } from 'lucide-react';
import FeatureButton from '@/components/ui/feature-button';

const CreateLivestreamModal = ({
  show,
  variant = 'outline',
  className,
}: {
  show?: boolean;
  variant?: 'outline' | 'ghost' | 'primary' | 'default';
  className?: string;
}) => {
  const [open, setOpen] = useState(show ?? false);
  const [isMultiDate, setIsMultiDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamType, setStreamType] = useState<
    'instant' | 'schedule' | undefined
  >();
  const router = useRouter();
  const { canUseFeatures, subscriptionStatus, organization } =
    useOrganizationContext();

  // Check if livestreaming is available in this tier
  const isLivestreamFeatureAvailable = organization?.subscriptionTier !== 'free'; 

  const handleClick = (e: React.MouseEvent) => {
    setOpen(true);
  };

  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: '',
      organizationId: organization?._id,
      streamDate: new Date(),
      streamTime: '',
      streamEndDate: new Date(),
      streamEndTime: '',
      isMultipleDate: isMultiDate,
    },
  });

  const { watch } = form;
  const streamDate = watch('streamDate');
  const streamTime = watch('streamTime');
  const streamEndDate = watch('streamEndDate');
  const streamEndTime = watch('streamEndTime');

  const handleModalClose = () => {
    setOpen(false);
    setStreamType(undefined);
    setIsMultiDate(false);
    form.reset();
  };

  const parseDate = (date?: Date, time?: string) => {
    return new Date(
      `${formatDate(date || new Date(), 'YYYY-MM-DD')}T${time || '00:00'}`
    );
  };

  const formattedDate = parseDate(streamDate, streamTime);
  const formattedEndDate = parseDate(streamEndDate, streamEndTime);

  const isPast = formattedDate < new Date();
  const validateEndDate = formattedEndDate < formattedDate;
  const isScheduleFormDisable = !streamDate || !streamTime || isPast;

  const isSchedule = streamType === 'schedule';

  function onSubmit(values: z.infer<typeof StageSchema>) {
    setIsLoading(true);
    let streamId: string | undefined;
    // destructure and omit streamTime from the payload
    const { streamTime, streamEndTime, ...otherValues } = values;
    createStageAction({
      stage: {
        ...otherValues,
        streamDate: isSchedule ? formattedDate : new Date(),
        streamEndDate: isMultiDate ? formattedEndDate : new Date(),
        isMultipleDate: isMultiDate,
      },
    })
      .then((response) => {
        toast.success(`Stream ${!isSchedule ? 'created' : 'scheduled'}`);
        streamId = response?._id as string;

        router.push(`/studio/${organization?._id}/livestreams/${streamId}`);
      })
      .catch((error) => {
        const errorMessage = error.message || 'Failed to create livestream';
        toast.error(errorMessage);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        handleModalClose();
      });
  }

  // Use FeatureButton for free tier or when features are not available
  if (!isLivestreamFeatureAvailable || !canUseFeatures) {
    return (
      <FeatureButton
        variant={variant}
        className="flex items-center gap-2"
        forceLockedState={true}
      >
        <Radio className="w-5 h-5" />
        Create Livestream
      </FeatureButton>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setStreamType(undefined);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className="flex items-center gap-2"
          onClick={handleClick}
        >
          <LuRadio className="w-5 h-5" />
          Create Livestream
        </Button>
      </DialogTrigger>
      {!streamType ? (
        <CreateLivestreamOptions setStreamType={setStreamType} />
      ) : (
        <DialogContent className="overflow-auto bg-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {!isSchedule ? 'Create' : 'Schedule'} livestream
            </DialogTitle>
            <DialogDescription>
              Newly created streams are assigned a special key and RTMP ingest
              URL to stream into.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Stream name</FormLabel>
                    <FormControl>
                      <Input
                        max={30}
                        placeholder="e.g. My first livestream"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem className="flex p-1 mt-4 aspect-video">
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <ImageUpload
                        options={{
                          placeholder:
                            'Click to upload image here. Maximum image file size is 20MB. Best resolution of 1920 x 1080. Aspect ratio of 16:9. ',
                          aspectRatio: 1,
                          resize: true,
                        }}
                        className="m-auto w-full h-full text-black bg-neutrals-300"
                        path={`livestreams/${organization?._id}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSchedule && (
                <>
                  <div className="mt-6">
                    <p
                      className="text-sm"
                      onClick={() => setIsMultiDate(!isMultiDate)}
                    >
                      Streaming multiple days?
                    </p>
                    <div className="flex gap-5 items-center mt-1">
                      <div className="flex gap-1 items-center">
                        <Checkbox
                          checked={isMultiDate}
                          onCheckedChange={() => setIsMultiDate(true)}
                        />
                        <Label>Yes</Label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Checkbox
                          defaultChecked
                          onCheckedChange={() => setIsMultiDate(!isMultiDate)}
                          checked={!isMultiDate}
                        ></Checkbox>
                        <Label>No</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-4 space-x-3">
                    <FormField
                      control={form.control}
                      name="streamDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel required>
                            Stream {isMultiDate ? 'Start' : ''} Date
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value as Date}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streamTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel required>
                            Stream {isMultiDate ? 'Start' : ''} Time
                          </FormLabel>
                          <FormControl>
                            <TimePicker
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isPast && (
                    <p className="mt-1 text-[12px] text-destructive">
                      Couldn&apos;t schedule. The date and time selected are too
                      far in the past.
                    </p>
                  )}
                  {isMultiDate && (
                    <>
                      <div className="flex mt-4 space-x-3">
                        <FormField
                          control={form.control}
                          name="streamEndDate"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel required>Stream End Date</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value as Date}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="streamEndTime"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel required>Stream End Time</FormLabel>
                              <FormControl>
                                <TimePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {validateEndDate && (
                        <p className="mt-1 text-[12px] text-destructive">
                          Couldn&apos;t schedule. End date and time selected are
                          too far in the past.
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
              <DialogFooter className="mt-8">
                <Button onClick={handleModalClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  variant="outlinePrimary"
                  disabled={
                    getFormSubmitStatus(form) ||
                    isLoading ||
                    (isSchedule && isScheduleFormDisable)
                  }
                  type="submit"
                >
                  {!isSchedule ? 'Create' : 'Schedule'} livestream
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreateLivestreamModal;
