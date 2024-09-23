'use client';

import { Button } from '@/components/ui/button';

import { markerSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuPlus } from 'react-icons/lu';
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
import { Input } from '@/components/ui/input';
import { IExtendedMarker } from '@/lib/types';
import { createMarkersAction, updateMarkersAction } from '@/lib/actions/marker';

const AddOrEditMarkerForm = ({
  stageId,
  organizationId,
  markerToEdit,
  onCancel,
}: {
  stageId: string;
  organizationId: string;
  markerToEdit?: IExtendedMarker; // Add this prop
  onCancel?: () => void; // Add this prop
}) => {
  const [showForm, setShowForm] = useState(!!markerToEdit);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof markerSchema>>({
    resolver: zodResolver(markerSchema),
    defaultValues: markerToEdit
      ? {
          ...markerToEdit,
          date: markerToEdit.date || new Date().toISOString(),
          stageId: markerToEdit.stageId.toString(),
          organizationId: markerToEdit.organizationId.toString(),
          speakers: markerToEdit.speakers?.map((speaker) => ({
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
          start: 0,
          end: 0,
        },
  });

  const handleClose = () => {
    form.reset();
    setShowForm(false);
    onCancel?.();
  };

  const handleSubmit = async (values: z.infer<typeof markerSchema>) => {
    setLoading(true);
    try {
      if (markerToEdit) {
        // Update existing marker
        await updateMarkersAction({
          markers: {
            ...values,
            _id: markerToEdit._id,
            speakers: markerToEdit.speakers,
          },
        });
        handleClose();
        toast.success('Marker updated successfully');
      } else {
        // Create new marker
        await createMarkersAction({
          markers: { ...values, speakers: [] },
        });
        handleClose();
        toast.success('Marker added successfully');
      }
    } catch (error) {
      toast.error(
        markerToEdit ? 'Error updating marker' : 'Error creating marker'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showForm ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
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
              name="start"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Start:</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                        }}
                        placeholder="Input start"
                        className="bg-white w-full"
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
                  <div className="flex items-center gap-2">
                    <FormLabel className="">End: </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          // Ensure end time is greater than start time
                          const startValue = form.getValues('start');
                          if (value <= startValue) {
                            form.setError('end', {
                              type: 'manual',
                              message:
                                'End time must be greater than start time',
                            });
                          } else {
                            form.clearErrors('end');
                          }
                        }}
                        placeholder="Input end"
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="">Color: </FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="bg-white p-0" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 items-center">
              <Button variant={'outline'} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="w-full"
                variant="primary"
                type="submit"
                loading={loading}
              >
                {markerToEdit ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button
          variant={'primary'}
          size={'sm'}
          onClick={() => setShowForm(true)}
          className="mt-3"
        >
          <LuPlus className="mr-2" /> Add Marker
        </Button>
      )}
    </div>
  );
};

export default AddOrEditMarkerForm;
