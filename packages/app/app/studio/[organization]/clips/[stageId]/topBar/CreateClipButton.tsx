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
import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { fetchSession } from '@/lib/services/sessionService';
import { IExtendedSession, IExtendedStage } from '@/lib/types';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { fetchStage } from '@/lib/services/stageService';

const CreateClipButton = ({
  organizationId,
  liveRecordingId,
}: {
  organizationId: string;
  liveRecordingId?: string;
}) => {
  const { isLoading, markers, stageId, setIsCreatingClip, startTime, endTime } =
    useClipContext();
  const [selectedMarkerId, setSelectedMarkerId] = useState('');
  const [isCreateClip, setIsCreateClip] = useState(false);
  const [sessionRecording, setSessionRecording] =
    useState<IExtendedSession | null>(null);
  const [stage, setStage] = useState<IExtendedStage | null>(null);
  const { searchParams, handleTermChange } = useSearchParams();

  const sessionId = searchParams.get('sessionId');

  const getSession = async () => {
    if (!sessionId) return;
    const session = await fetchSession({ session: sessionId });
    setSessionRecording(session);
  };

  const getStage = async () => {
    if (!stageId) return;
    const stage = await fetchStage({ stage: stageId });
    setStage(stage);
  };

  useEffect(() => {
    getSession();
    getStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const selectedMarker = markers.find(
    (marker) => marker._id === selectedMarkerId
  );
  const form = useForm<z.infer<typeof clipSchema>>({
    resolver: zodResolver(clipSchema),
    defaultValues: {
      name: '',
      description: 'No description',
      start: new Date().getTime(),
      end: new Date().getTime(),
      organizationId: organizationId,
      stageId: stageId,
      speakers: [],
      startClipTime: startTime.displayTime,
      endClipTime: endTime.displayTime,
    },
  });

  useEffect(() => {
    if (selectedMarker) {
      form.reset({
        name: selectedMarker.name ?? '',
        description: selectedMarker.description ?? 'No description',
        start: selectedMarker.start,
        end: selectedMarker.end,
        startClipTime: startTime.displayTime,
        endClipTime: endTime.displayTime,
        organizationId: organizationId,
        stageId: stageId,
        speakers:
          selectedMarker.speakers?.map((speaker) => ({
            ...speaker,
            eventId: speaker?.eventId?.toString(),
          })) ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarker]);

  const handleCreateClip = async (values: z.infer<typeof clipSchema>) => {
    setIsCreateClip(true);
    if (
      !stage?.streamSettings?.playbackId ||
      (!sessionRecording?.assetId && !liveRecordingId)
    ) {
      setIsCreateClip(false);
      return toast.error('Missing required data for clip creation');
    }

    if (endTime.unix < startTime.unix) {
      setIsCreateClip(false);
      return toast.error('End time must be greater than start time');
    }

    try {
      const session = await createSessionAction({
        session: {
          name: values.name,
          description: values.description,
          speakers: values?.speakers,
          type: SessionType.clip,
          startClipTime: startTime.unix,
          endClipTime: endTime.unix,
          start: values.start,
          end: values.end,
          organizationId,
          stageId,
        },
      });

      if (!session) {
        throw new Error('Failed to create session');
      }

      let clipData = {
        playbackId: stage?.streamSettings?.playbackId,
        start: startTime.unix,
        end: endTime.unix,
        sessionId: session._id,
        recordingId: sessionRecording?.assetId ?? liveRecordingId ?? '',
      };

      await createClipAction(clipData);

      toast.success('Clip created');
      setIsCreatingClip(false);
    } catch (error) {
      console.error('Error creating clip:', error);
      toast.error('Error creating clip');
    } finally {
      setIsCreateClip(false);
    }
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
          <CardContent className="border space-y-4 pt-2">
            {markers && markers.length > 0 && (
              <>
                <FormLabel>Select Marker for Clip</FormLabel>
                <Select onValueChange={(value) => setSelectedMarkerId(value)}>
                  <SelectTrigger className="rounded-lg border bg-white">
                    <SelectValue placeholder="select marker"></SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
                    {markers.map((marker) => (
                      <SelectItem key={marker._id} value={marker._id}>
                        {marker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

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
                loading={isLoading || isCreateClip}
              >
                {isCreateClip ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateClipButton;
