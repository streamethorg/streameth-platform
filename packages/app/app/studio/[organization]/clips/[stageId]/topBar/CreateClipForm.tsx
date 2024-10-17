'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LuRotateCcw } from 'react-icons/lu';
import { Label } from '@/components/ui/label';
import Dropzone from '../../../library/components/upload/Dropzone';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { clipSchema } from '@/lib/schema';
import { IExtendedMarker } from '@/lib/types';
import { Uploads } from '../../../library/components/UploadVideoDialog';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';

const CreateClipForm = ({
  form,
  handleCreateClip,
  markers,
  selectedMarkerId,
  setSelectedMarkerId,
  handleClearMarker,
  organizationId,
  stageId,
  isLoading,
  isCreateClip,
  setIsCreatingClip,
}: {
  form: UseFormReturn<z.infer<typeof clipSchema>>;
  handleCreateClip: (values: z.infer<typeof clipSchema>) => void;
  markers: IExtendedMarker[];
  selectedMarkerId: string;
  setSelectedMarkerId: (id: string) => void;
  handleClearMarker: () => void;
  organizationId: string;
  stageId: string;
  isLoading: boolean;
  isCreateClip: boolean;
  setIsCreatingClip: Dispatch<SetStateAction<boolean>>;
}) => {
  const [introUpload, setIntroUpload] = useState<Uploads>({});
  const [outroUpload, setOutroUpload] = useState<Uploads>({});
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateClip)}
        className="space-y-2 h-full"
      >
        <CardContent className="border space-y-4 pt-2">
          {markers && markers.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <FormLabel>Select Marker for Clip</FormLabel>
                <Button
                  className="ml-2"
                  variant={'outline'}
                  onClick={handleClearMarker}
                  type="button"
                >
                  <LuRotateCcw size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
              <Select
                value={selectedMarkerId}
                onValueChange={(value) => setSelectedMarkerId(value)}
              >
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
          <div className="flex flex-row w-full items-center space-x-4">
            <FormField
              control={form.control}
              name="captionEnabled"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch id="captionEnabled" onChange={field.onChange} />
                        <Label htmlFor="captionEnabled">Captions</Label>
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
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aspect-ratio-switch"
                          onChange={(checked) => {
                            field.onChange(checked ? '9:16' : '16:9'); // Set aspect ratio based on switch state
                          }}
                        />
                        <Label htmlFor="aspect-ratio-switch">
                          9:16 (Aspect Ratio)
                        </Label>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row w-full space-x-2">
            <FormField
              control={form.control}
              name="introAnimation"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <FormLabel className="">Intro animation</FormLabel>
                    <FormControl>
                      <Dropzone
                        uploads={introUpload}
                        setUploads={setIntroUpload}
                        organizationId={organizationId}
                        stageId={stageId}
                        onChange={field.onChange}
                        type={SessionType.animation}
                        maxFiles={1}
                        maxSize={50 * 1024 * 1024}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outroAnimation"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <FormLabel className="">Outro animation</FormLabel>
                    <FormControl>
                      <Dropzone
                        uploads={outroUpload}
                        setUploads={setOutroUpload}
                        organizationId={organizationId}
                        stageId={stageId}
                        // this returns the sessionId
                        onChange={field.onChange}
                        type={SessionType.animation}
                        maxFiles={1}
                        maxSize={50 * 1024 * 1024}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="flex flex-row w-full space-x-2">
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
            </div> */}
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
  );
};

export default CreateClipForm;
