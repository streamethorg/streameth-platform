'use client';

import { Button } from '@/components/ui/button';
import { markerSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createMarkerAction, updateMarkersAction } from '@/lib/actions/marker';
import { useClipContext } from '../../ClipContext';
import { IExtendedMarker } from '@/lib/types';
import { LuArrowLeftToLine, LuArrowRightToLine, LuPlus } from 'react-icons/lu';
import { useMarkersContext } from './markersContext';

const AddOrEditMarkerForm = () => {
  const { stageId, videoRef } = useClipContext();

  const {
    markers,
    setIsAddingOrEditingMarker,
    selectedMarkerId,
    setSelectedMarkerId,
    fetchAndSetMarkers,
    setMarkers,
    setFilteredMarkers,
    organizationId,
  } = useMarkersContext();

  const [loading, setLoading] = useState(false);
  const selectedMarker = markers.find(
    (marker) => marker._id === selectedMarkerId
  );
  const currentTime = videoRef.current?.currentTime ?? 0;
  const maxEndTime = videoRef.current?.duration ?? 0;
  const form = useForm<z.infer<typeof markerSchema>>({
    resolver: zodResolver(markerSchema),
    defaultValues: selectedMarker
      ? {
          ...selectedMarker,
          date: selectedMarker.date || new Date().toISOString(),
          stageId: selectedMarker.stageId.toString(),
          organizationId: selectedMarker.organizationId.toString(),
          speakers: selectedMarker.speakers?.map((speaker) => ({
            ...speaker,
            eventId: speaker?.eventId?.toString(),
            organizationId: speaker?.organizationId?.toString(),
          })),
          pretalxSessionCode: selectedMarker.pretalxSessionCode,
        }
      : {
          name: '',
          stageId: stageId,
          organizationId: organizationId,
          date: new Date().toISOString(),
          color: '#FFA500',
          start: new Date().getTime(),
          end: new Date().getTime() + 1,
          startClipTime: Math.round(Number(currentTime)),
          endClipTime: Math.round(Number(currentTime + 1)),
        },
  });

  const handleClose = () => {
    form.reset();
    setIsAddingOrEditingMarker(false);
  };

  const handleSubmit = async (values: z.infer<typeof markerSchema>) => {
    setLoading(true);
    try {
      if (selectedMarker) {
        // Update existing marker
        const updatedMarker: IExtendedMarker = {
          ...values,
          _id: selectedMarker._id,
          speakers: selectedMarker.speakers,
        };
        await updateMarkersAction({ markers: updatedMarker });
        // Update the markers array in the context
        const updateMarkerInArray = markers.map((marker) =>
          marker._id === selectedMarker._id ? updatedMarker : marker
        );
        setMarkers(updateMarkerInArray);
        setFilteredMarkers(updateMarkerInArray);

        handleClose();
        setSelectedMarkerId('');
        toast.success('Marker updated successfully');
      } else {
        // Create new marker
        await createMarkerAction({
          marker: { ...values, speakers: [] },
        });
        handleClose();
        fetchAndSetMarkers();
        toast.success('Marker added successfully');
      }
    } catch (error) {
      toast.error(
        selectedMarker ? 'Error updating marker' : 'Error creating marker'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetStartOrSetEnd = (set: 'start' | 'end') => {
    if (set === 'start') {
      if (form.getValues('endClipTime') > currentTime) {
        form.setValue('startClipTime', Math.round(Number(currentTime)));
      } else {
        toast.error('Start time must be less than end time');
      }
    } else if (form.getValues('startClipTime') < currentTime) {
      form.setValue('endClipTime', Math.round(Number(currentTime)));
    } else {
      toast.error('End time must be greater than start time');
    }
  };

  return (
    <Card className="border-none rounded-none shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <CardContent className="border space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-row gap-2 items-center">
                  <FormLabel className="">Name:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Input name"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row w-full space-x-6">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="startClipTime"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center w-full gap-2">
                          <FormLabel>Start:</FormLabel>
                          <FormControl className="w-full">
                            <Input
                              type="number"
                              step="1"
                              {...field}
                              placeholder="Input start"
                              className="bg-white"
                              min={0}
                              max={maxEndTime}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ''
                                    ? ''
                                    : Math.round(Number(e.target.value));
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                        </div>

                        <Button
                          onClick={() => handleSetStartOrSetEnd('start')}
                          type="button"
                          variant={'outline'}
                        >
                          <LuArrowLeftToLine className="mr-2" />
                          Set Start
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="endClipTime"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center gap-2">
                          <FormLabel className="">End: </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              {...field}
                              placeholder="Input end"
                              className="bg-white"
                              onChange={(e) => {
                                const value =
                                  e.target.value === ''
                                    ? ''
                                    : Math.round(Number(e.target.value));
                                field.onChange(value);
                              }}
                              min={form.getValues('startClipTime') + 1}
                              max={maxEndTime}
                            />
                          </FormControl>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleSetStartOrSetEnd('end')}
                          variant={'outline'}
                          size={'sm'}
                        >
                          Set End
                          <LuArrowRightToLine className="ml-2" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-row gap-2 items-center">
                  <FormLabel className="">Color: </FormLabel>
                  <FormControl>
                    <Input type="color" {...field} className="bg-white p-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                className="w-1/4"
                variant={'outline'}
                onClick={() => {
                  setIsAddingOrEditingMarker(false);
                  setSelectedMarkerId('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-3/4"
                variant="primary"
                type="submit"
                loading={loading}
              >
                {loading ? (
                  selectedMarker ? (
                    'Updating...'
                  ) : (
                    'Adding...'
                  )
                ) : selectedMarker ? (
                  'Update'
                ) : (
                  <>
                    <LuPlus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AddOrEditMarkerForm;
