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
  LuSmartphone,
  LuSubtitles,
  LuEye,
} from 'react-icons/lu';
import { Label } from '@/components/ui/label';

import { formatClipTime } from '@/lib/utils/time';
import { useClipContext } from '../../ClipContext';
import { IExtendedSession } from '@/lib/types';
import SelectAnimation from '../../topBar/SelectAnimation';
import Combobox from '@/components/ui/combo-box';
import { useMarkersContext } from '../markers/markersContext';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { fetchAllSessions } from '@/lib/services/sessionService';
import { useCreateClip } from '@/lib/hooks/useCreateClip';
import useClickOutside from '@/lib/hooks/useClickOutside';
const CreateClipForm = () => {
  const { handleCreateClip, form, isCreateClip, handleClearMarker } =
    useCreateClip();

  const { isLoading, setIsCreatingClip, startTime, endTime, organizationId } =
    useClipContext();

  const { markers, selectedMarkerId, setSelectedMarkerId } =
    useMarkersContext();

  const [animations, setAnimations] = useState<IExtendedSession[]>([]);

  useEffect(() => {
    const fetchAnimations = async () => {
      const animations = await fetchAllSessions({
        type: SessionType.animation,
        organizationSlug: organizationId,
      });
      setAnimations(animations.sessions);
    };
    fetchAnimations();
  }, [organizationId]);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  useClickOutside(colorPickerRef, () => setShowColorPicker(false));

  const colorPresets = [
    '#6C757D',
    '#FFA07A',
    '#20C997',
    '#FFC107',
    '#0D6EFD',
    '#DC3545',
    '#198754',
    '#0DCAF0',
    '#6F42C1',
  ];

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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="captionEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormControl>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(!field.value);
                                if (!field.value) {
                                  setShowColorPicker(true);
                                }
                              }}
                              onDoubleClick={() => {
                                if (field.value) {
                                  setShowColorPicker(!showColorPicker);
                                }
                              }}
                              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                                field.value ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              <LuSubtitles size={20} />
                            </button>
                            {field.value && form.watch('captionColor') && (
                              <div
                                className="w-4 h-4 rounded-md border border-gray-200"
                                style={{
                                  backgroundColor: form.watch('captionColor'),
                                }}
                              />
                            )}
                          </div>
                          <Label className="text-xs">Captions</Label>
                        </div>
                      </FormControl>
                    </div>
                    {field.value && showColorPicker && (
                      <div
                        ref={colorPickerRef}
                        className="absolute mt-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10"
                      >
                        <Label className="text-sm mb-2">Text Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {colorPresets.map((color) => (
                            <Button
                              key={color}
                              variant="outline"
                              className="w-8 h-8 p-0"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                form.setValue('captionColor', color);
                                setShowColorPicker(false);
                              }}
                              type="button"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
