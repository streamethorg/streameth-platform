'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  LuRotateCcw,
  LuScissorsLineDashed,
} from 'react-icons/lu';

import { formatClipTime } from '@/lib/utils/time';
import { useClipPageContext } from '../../ClipPageContext';
import Combobox from '@/components/ui/combo-box';
import { useMarkersContext } from '../markers/markersContext';
import { useCreateClip } from '@/lib/hooks/useCreateClip';
import { useEventContext } from '../../Timeline/EventConntext';
const CreateClipForm = () => {
  const { handleCreateClip, form, isCreateClip, handleClearMarker } =
    useCreateClip();

  const { isLoading, setIsCreatingClip } =
    useClipPageContext();

  const { getEventsBounds } = useEventContext();
  const { minStart, maxEnd } = getEventsBounds();

  const { markers, selectedMarkerId, setSelectedMarkerId } =
    useMarkersContext();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateClip)}
        className="space-y-2 h-full"
      >
        <CardContent className="space-y-4 pt-2">
          {/* Marker Selection */}
          {markers && markers.length > 0 && (
            <>
              <div className="flex flex-col w-full justify-between gap-2">
                <FormLabel className="w-full">Select Marker</FormLabel>

                <div className=" flex flex-row gap-2 w-2/3">
                  <Combobox
                    items={[
                      ...markers.map((marker) => ({
                        label:
                          marker.name.length > 20
                            ? `${marker.name.substring(0, 20)}...`
                            : marker.name,
                        value: marker._id,
                      })),
                    ]}
                    variant="outline"
                    value={selectedMarkerId}
                    setValue={(value) => setSelectedMarkerId(value)}
                  />
                  <Button
                    variant={'outline'}
                    onClick={handleClearMarker}
                    type="button"
                    className="w-1/3"
                  >
                    <LuRotateCcw size={16} />
                    {/* Clear */}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2 ">
                  <FormLabel>Name:</FormLabel>
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

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2">
                  <FormLabel>Description:</FormLabel>
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

          {/* Time Display */}
          <div className="grid grid-cols-2 gap-x-2">
            <div className="flex gap-1 items-center">
              <FormLabel>Clip duration:</FormLabel>
              <p className="text-sm">{formatClipTime(maxEnd - minStart)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>
        </CardContent>

        {/* Footer */}
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
              {isCreateClip ? (
                'Creating...'
              ) : (
                <>
                  <LuScissorsLineDashed className="mr-2 h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export default CreateClipForm;
