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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createMarkerAction, updateMarkersAction } from '@/lib/actions/marker';
import { useClipContext } from '../../ClipContext';
import { IExtendedMarker } from '@/lib/types';

const AddOrEditMarkerForm = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const {
    selectedMarkerId,
    markers,
    stageId,
    videoRef,
    setIsAddingOrEditingMarker,
    setSelectedMarkerId,
    fetchAndSetMarkers,
    setMarkers,
    setFilteredMarkers,
  } = useClipContext();
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
          })),
        }
      : {
          name: '',
          stageId: stageId,
          organizationId: organizationId,
          date: new Date().toISOString(),
          color: '#FFA500',
          start: new Date().getTime(),
          end: new Date().getTime() + 1,
          startClipTime: currentTime,
          endClipTime: currentTime + 1,
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
        const updatedMarker = {
          ...values,
          _id: selectedMarker._id,
          speakers: selectedMarker.speakers,
        };
        await updateMarkersAction({ markers: updatedMarker });
        // Update the markers array in the context
        const updateMarkerInArray = (prevMarkers: IExtendedMarker[]) =>
          prevMarkers.map((marker) =>
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

  return (
    <Card className="border-none rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">
          {selectedMarker ? 'Edit Marker' : 'Add Marker'}
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <CardContent className="border space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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

            <div className="flex flex-row w-full space-x-2">
              <FormField
                control={form.control}
                name="startClipTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col w-full gap-2">
                      <FormLabel>Start:</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          type="number"
                          {...field}
                          placeholder="Input start"
                          className="bg-white w-full"
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                          }}
                          max={maxEndTime}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endClipTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col w-full gap-2">
                      <FormLabel className="">End: </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Input end"
                          className="bg-white"
                          // value={endTime.displayTime.toFixed(0)}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value);
                            // Ensure end time is greater than start time
                            const startValue = form.getValues('startClipTime');
                            if (value <= startValue || value > maxEndTime) {
                              form.setError('endClipTime', {
                                type: 'manual',
                                message:
                                  'End time must be greater than start time and less than the video duration',
                              });
                            } else {
                              form.clearErrors('endClipTime');
                            }
                          }}
                          max={maxEndTime}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
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
                {loading
                  ? selectedMarker
                    ? 'Updating...'
                    : 'Adding...'
                  : selectedMarker
                    ? 'Update'
                    : 'Add'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AddOrEditMarkerForm;
