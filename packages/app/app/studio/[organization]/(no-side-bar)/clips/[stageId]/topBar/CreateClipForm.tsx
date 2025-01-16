'use client';

import React, { useState, useEffect } from 'react';
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
  LuSmartphone,
  LuSubtitles,
  LuEye,
} from 'react-icons/lu';
import { Label } from '@/components/ui/label';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { clipSchema } from '@/lib/schema';
import { formatClipTime } from '@/lib/utils/time';
import { useClipContext } from '../ClipContext';
import { IExtendedSession } from '@/lib/types';
import SelectAnimation from './SelectAnimation';
import Combobox from '@/components/ui/combo-box';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { fetchAllSessions } from '@/lib/services/sessionService';

const CreateClipForm = ({
  form,
  handleCreateClip,
  handleClearMarker,
  organizationId,
  isCreateClip,
  handlePreview,
}: {
  form: UseFormReturn<z.infer<typeof clipSchema>>;
  handleCreateClip: (values: z.infer<typeof clipSchema>) => void;
  handleClearMarker: () => void;
  organizationId: string;
  isCreateClip: boolean;
  handlePreview: () => void;
}) => {
  const { isLoading, setIsCreatingClip, startTime, endTime, stageId } =
    useClipContext();

  const { markers, selectedMarkerId, setSelectedMarkerId } =
    useMarkersContext();

  const [animations, setAnimations] = useState<IExtendedSession[]>([]);

  useEffect(() => {
    const fetchAnimations = async () => {
      const animations = await fetchAllSessions({
        stageId,
        type: SessionType.animation,
      });
      setAnimations(animations.sessions);
    };
    fetchAnimations();
  }, [stageId]);

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
              <div className="flex items-center justify-between gap-2">
                <FormLabel className="w-full">Select Marker</FormLabel>

                <div className="w-full max-w-[200px]">
                  <Combobox
                    items={[
                      ...markers.map((marker) => ({
                        label: marker.name,
                        value: marker._id,
                      })),
                    ]}
                    variant="outline"
                    value={selectedMarkerId}
                    setValue={(value) => setSelectedMarkerId(value)}
                  />
                </div>

                <Button
                  variant={'outline'}
                  onClick={handleClearMarker}
                  type="button"
                >
                  <LuRotateCcw size={16} />
                  {/* Clear */}
                </Button>
              </div>
            </>
          )}

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
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
              <FormLabel>Start:</FormLabel>
              <p className="text-sm">{formatClipTime(startTime.displayTime)}</p>
            </div>
            <div className="flex gap-1 items-center">
              <FormLabel>End:</FormLabel>
              <p className="text-sm">{formatClipTime(endTime.displayTime)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Controls */}
          <div className="flex flex-row w-full items-center space-x-4">
            <FormField
              control={form.control}
              name="captionEnabled"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                            field.value ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          <LuSubtitles size={20} />
                        </button>
                        <Label htmlFor="captionEnabled" className="text-xs">
                          Captions
                        </Label>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedAspectRatio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <div className="flex flex-col items-center space-x-1">
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(
                              field.value === '16:9' ? '9:16' : '16:9'
                            )
                          }
                          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                            field.value === '9:16'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          <LuSmartphone size={20} />
                        </button>
                        <Label
                          htmlFor="aspect-ratio-switch"
                          className="text-xs"
                        >
                          9:16 Format
                        </Label>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Animation Fields */}
          <div className="grid grid-cols-2 gap-x-2">
            {/* Left column */}
            <SelectAnimation
              animations={animations}
              form={form}
              name="introAnimation"
              label="Intro animation"
              organizationId={organizationId}
            />
            {/* Right column */}
            <SelectAnimation
              animations={animations}
              form={form}
              name="outroAnimation"
              label="Outro animation"
              organizationId={organizationId}
            />
          </div>
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
            <Button variant={'secondary'} onClick={handlePreview} type="button">
              <LuEye className="h-4 w-4 mr-2" />
              Preview
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
