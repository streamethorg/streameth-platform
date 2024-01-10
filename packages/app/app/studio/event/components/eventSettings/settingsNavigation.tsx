'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IEvent } from 'streameth-server/model/event'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ImageUpload from '../../../../../components/misc/form/imageUpload'
import ColorPicker from '../../../../../components/misc/form/colorPicker'
import TimePicker from '../../../../../components/misc/form/timePicker'
import { eventSchema } from '@/lib/schema'
import DataConfigElement from './dataConfigElement'
import DatePicker from '../../../../../components/misc/form/datePicker'
import Combobox from '@/components/ui/combo-box'
import moment from 'moment-timezone'

const SettingsNavigation = ({ event }: { event: IEvent }) => {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: event.name,
      eventDescription: event.description,
      startDate: event.start.toString(),
      startTime: event.startTime,
      endDate: event.end.toString(),
      endTime: event.endTime,
      eventLocation: event.location,
      eventLogo: event.logo,
      eventBanner: event.banner,
      eventColor: event.accentColor,
      dataImporter: event.dataImporter,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof eventSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="px-2">
            <AccordionTrigger>Basics</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <FormField
                control={form.control}
                name="eventName"
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
                name="eventDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="a description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="ml-auto">
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="time" className="px-2">
            <AccordionTrigger>Time</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <div className="flex flex-col space-y-8">
                <div className="flex flex-row w-full space-x-1">
                  <FormField
                    control={form.control}
                    name="startDate"
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
                <div className="flex flex-row w-full space-x-1">
                  <FormField
                    control={form.control}
                    name="endDate"
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
                name="eventLocation"
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="px-2">
            <AccordionTrigger>Appearance</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <div className="flex flex-row space-x-4">
                <div className="flex w-1/6">
                  <FormField
                    control={form.control}
                    name="eventLogo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Logo</FormLabel>
                        <FormControl>
                          <ImageUpload
                            {...field}
                            onChange={field.onChange}
                            aspectRatio={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-2/6 ">
                  <FormField
                    control={form.control}
                    name="eventCover"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Cover</FormLabel>
                        <FormControl>
                          <ImageUpload
                            {...field}
                            onChange={field.onChange}
                            aspectRatio={16 / 9}
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
                    name="eventBanner"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Banner</FormLabel>
                        <FormControl>
                          <ImageUpload
                            {...field}
                            onChange={field.onChange}
                            aspectRatio={3 / 1}
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
                name="eventColor"
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

              <Button type="submit" className="ml-auto">
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="px-2">
            <AccordionTrigger>Event CMS</AccordionTrigger>
            <AccordionContent className="p-2 space-y-8">
              <span>
                Import you speaker data and your schedule from one of
                our supported data providers.
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
              <Button type="submit" className="ml-auto">
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}

export default SettingsNavigation

function generateTimezones() {
  const timezones = moment.tz.names()
  return timezones.map((timezone) => ({
    label: timezone,
    value: timezone,
  }))
}
