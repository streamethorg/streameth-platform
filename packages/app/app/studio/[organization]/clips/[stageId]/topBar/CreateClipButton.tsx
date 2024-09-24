'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClipAction } from '@/lib/actions/sessions';
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

// todo
/*
 

 - correctly implement handleCreateClip: make sure we pass unix time to createClipAction, the form is showing displaytime
 - create clip action should create a new session on the backend
 */
const CreateClipButton = ({ organizationId }: { organizationId: string }) => {
  const { isLoading, markers, stageId, setIsCreatingClip, startTime, endTime } =
    useClipContext();
  const [selectedMarkerId, setSelectedMarkerId] = useState('');
  const [isCreateClip, setIsCreateClip] = useState(false);

  const selectedMarker = markers.find(
    (marker) => marker._id === selectedMarkerId
  );
  const form = useForm<z.infer<typeof clipSchema>>({
    resolver: zodResolver(clipSchema),
    defaultValues: {
      name: '',
      description: '',
      start: startTime.displayTime,
      end: endTime.displayTime,
      organizationId: organizationId,
      stageId: stageId,
      speakers: [],
    },
  });

  useEffect(() => {
    if (selectedMarker) {
      form.reset({
        name: selectedMarker.name ?? '',
        description: selectedMarker.description ?? '',
        start: startTime.displayTime,
        end: endTime.displayTime,
        organizationId: organizationId,
        stageId: stageId,
        speakers:
          selectedMarker.speakers?.map((speaker) => ({
            ...speaker,
            eventId: speaker.eventId?.toString(),
          })) ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarker]);

  const handleCreateClip = async (values: z.infer<typeof clipSchema>) => {
    // await createClipAction({
    //   session: values,
    //   start: startTime.unix,
    //   end: endTime.unix,
    // })
    //   .then(async () => {
    //     toast.success('Clip created');
    //   })
    //   .catch(() => {
    //     toast.error('Error creating clip');
    //   })
    //   .finally(() => {});
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
