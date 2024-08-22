'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { eventSchema } from '@/lib/schema';

import DataConfigElement from '@/components/misc/form/dataConfigElement';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combo-box';
import ImageUpload from '@/components/misc/form/imageUpload';
import ColorPicker from '@/components/misc/form/colorPicker';
import TimePicker from '@/components/misc/form/timePicker';
import DatePicker from '@/components/misc/form/datePicker';
import { generateTimezones } from '@/lib/utils/time';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { syncEventImportAction, updateEventAction } from '@/lib/actions/events';
import { IExtendedEvent } from '@/lib/types';
import useSearchParams from '@/lib/hooks/useSearchParams';
import DeleteEvent from '../DeleteEventButton';

const EventAccordion = ({
  organizationId,
  event,
}: {
  organizationId: string;
  event: IExtendedEvent;
}) => {
  const { handleTermChange, searchParams } = useSearchParams();
  const [isUpdatingEvent, setIsUpdatingEvent] = useState<boolean>(false);
  const [isSyncingEvent, setIsSyncingEvent] = useState<boolean>(false);
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      start: new Date(event.start),
      startTime: event.startTime,
      end: new Date(event.end),
      endTime: event.endTime,
      location: event.location,
      logo: event.logo,
      banner: event.banner,
      accentColor: event.accentColor,
      dataImporter: event.dataImporter,
      timezone: event.timezone,
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof eventSchema>) {
    setIsUpdatingEvent(true);
    const response = updateEventAction({
      event: {
        ...values,
        _id: event._id,
        slug: event.slug,
        organizationId: event.organizationId,
      },
    })
      .then((response) => {
        if (response) {
          toast.success('Event updated');
        } else {
          toast.error('Error updating event');
        }
      })
      .catch(() => {
        toast.error('Error updating event');
      })
      .finally(() => {
        setIsUpdatingEvent(false);
      });
  }

  const handleEventSync = async () => {
    setIsSyncingEvent(true);
    const response = syncEventImportAction({
      eventId: event._id,
      organizationId: event.organizationId as string,
    })
      .then((response) => {
        if (response) {
          toast.success('Event synced');
        } else {
          toast.error('Error syncing event');
        }
      })
      .catch(() => {
        toast.error('Error syncing event');
      })
      .finally(() => {
        setIsSyncingEvent(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <Accordion
          type="single"
          collapsible
          onValueChange={() => {
            handleTermChange([
              {
                key: 'settings',
                value: 'event',
              },
              { key: 'stage', value: '' },
              { key: 'stageSettings', value: '' },
            ]);
          }}
        >
          <AccordionItem value="item-1" className="px-2 text-black">
            <AccordionTrigger>Basics</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Description</FormLabel>
                    <FormControl>
                      <MDEditor
                        value={field.value}
                        onChange={(a) => field.onChange(a)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isUpdatingEvent}
                type="submit"
                className="ml-auto"
              >
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="time" className="px-2">
            <AccordionTrigger>Time</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <div className="flex flex-col space-y-8">
                <div className="flex flex-row space-x-1 w-full">
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">Start Time</FormLabel>
                        <FormControl>
                          <TimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row space-x-1 w-full">
                  <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">End Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">End Time</FormLabel>
                        <FormControl>
                          <TimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g Denver, US" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      Select the event timezone
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        items={generateTimezones()}
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isUpdatingEvent}
                type="submit"
                className="ml-auto"
              >
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="px-2">
            <AccordionTrigger>Appearance</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <div className="flex flex-row space-x-4">
                <div className="flex w-1/6">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Logo</FormLabel>
                        <FormControl>
                          <ImageUpload
                            options={{
                              resize: false,
                              aspectRatio: 1,
                            }}
                            path="events"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-2/6">
                  <FormField
                    control={form.control}
                    name="eventCover"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Cover</FormLabel>
                        <FormControl>
                          <ImageUpload
                            options={{
                              resize: false,
                              aspectRatio: 16 / 9,
                            }}
                            path="events"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-3/6">
                  <FormField
                    control={form.control}
                    name="banner"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Banner</FormLabel>
                        <FormControl>
                          <ImageUpload
                            path="events"
                            {...field}
                            onChange={field.onChange}
                            options={{
                              aspectRatio: 3 / 1,
                              resize: false,
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="accentColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Accent Color</FormLabel>
                    <FormControl>
                      <ColorPicker
                        color={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isUpdatingEvent}
                type="submit"
                className="ml-auto"
              >
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="px-2">
            <AccordionTrigger>Event CMS</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <span>
                Import your speaker data and your schedule from one of our
                supported data providers.
              </span>
              <FormField
                control={form.control}
                name="dataImporter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Data provider</FormLabel>
                    <FormControl>
                      <DataConfigElement
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-5 justify-between">
                <Button disabled={isUpdatingEvent} type="submit">
                  Save
                </Button>
                <Button
                  onClick={handleEventSync}
                  variant="secondary"
                  disabled={isSyncingEvent}
                  type="button"
                >
                  Sync
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="px-2">
            <AccordionTrigger>More</AccordionTrigger>
            <AccordionContent className="flex flex-col p-2 space-y-8">
              <DeleteEvent organizationId={organizationId} event={event} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
};

export default EventAccordion;
