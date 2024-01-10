'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '../create/lib/schema'
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
import ImageUpload from '../create/components/imageUpload'
import ColorPicker from '../create/components/colorPicker'
import TimePicker from '../create/components/timePicker'

const SettingsNavigation = ({ event }: { event: IEvent }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
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
            <AccordionContent className="p-2 space-y-4">
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
        </Accordion>
      </form>
    </Form>
  )
}

export default SettingsNavigation
