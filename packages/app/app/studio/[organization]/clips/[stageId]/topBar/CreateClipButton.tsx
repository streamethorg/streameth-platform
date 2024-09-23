'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClipAction, createSessionAction } from '@/lib/actions/sessions';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { useClipContext } from '../ClipContext';

import { clipSchema } from '@/lib/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

// const handleCreateClip = async () => {
//   if (!endTime || !startTime || endTime.unix < startTime.unix) {
//     toast.error('Start time must be earlier than end time.');
//     return;
//   }

//   if (!selectedRecording) {
//     toast.error('No recording selected.');
//     return;
//   }

//   let customSession: ISession = {
//     name,
//     description: 'Clip',
//     start: new Date().getTime(),
//     end: new Date().getTime(),
//     stageId,
//     organizationId,
//     speakers: [],
//     type: SessionType['clip'],
//   };
//   if (custom) {
//     customSession = await createSessionAction({
//       session: { ...customSession },
//     });
//   }

//   const session = custom
//     ? customSession
//     : sessions.find((s) => s._id === sessionId);

//   if (!session) {
//     toast.error('Session information is missing.');
//     return;
//   }

//   setIsLoading(true);
//   await createClipAction({
//     playbackId,
//     recordingId: selectedRecording,
//     start: startTime.unix,
//     end: endTime.unix,
//     sessionId: session._id as string,
//   })
//     .then(async () => {
//       setIsLoading(false);
//       setSessionId('');
//       setDialogOpen(false);

//       toast.success('Clip created');
//     })
//     .catch(() => {
//       setIsLoading(false);
//       toast.error('Error creating clip');
//     })
//     .finally(() => {
//       setIsLoading(false);
//       handleTermChange([
//         {
//           key: 'previewId',
//           value: session._id as string,
//         },
//       ]);
//     });
// };

// todo
/*
 - add marker select input to load marker details into clip form
 we can just access markers from contet array

 - correctly implement handleCreateClip: make sure we pass unix time to createClipAction, the form is showing displaytime
 */
const CreateClipButton = ({ organizationId }: { organizationId: string }) => {
  const { isLoading, markers, stageId, setIsCreatingClip, startTime, endTime } =
    useClipContext();

  const form = useForm<z.infer<typeof clipSchema>>({
    resolver: zodResolver(clipSchema),
    defaultValues: {
      name: '',
      description: 'Clip',
      start: startTime.displayTime,
      end: endTime.displayTime,
      organizationId: organizationId,
      stageId: stageId,
    },
  });

  const handleCreateClip = async (values: z.infer<typeof clipSchema>) => {
    return;
  };

  return (
    <Card className="border-none rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Create Clip</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateClip)}
          className="space-y-2"
        >
          <CardContent className="border space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel className="">Name:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Input name"
                        className="bg-white"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel className="">Description:</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Clip description"
                        className="bg-white"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row w-full space-x-2">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col w-full gap-2">
                      <FormLabel>Start:</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          type="number"
                          {...field}
                          disabled
                          placeholder="Input start"
                          className="bg-white w-full"
                          value={startTime.displayTime.toFixed(0)}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col w-full gap-2">
                      <FormLabel className="">End: </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled
                          placeholder="Input end"
                          className="bg-white"
                          value={endTime.displayTime.toFixed(0)}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button
                className="w-1/4"
                variant={'outline'}
                onClick={() => setIsCreatingClip(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-3/4"
                variant="primary"
                type="submit"
                loading={isLoading}
              >
                {'Add'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateClipButton;
