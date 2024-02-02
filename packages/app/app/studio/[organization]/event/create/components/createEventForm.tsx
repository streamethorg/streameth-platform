'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '@/lib/schema'
import * as z from 'zod'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import DatePicker from '@/components/misc/form/datePicker'
import Combobox from '@/components/ui/combo-box'
import ImageUpload from '@/components/misc/form/imageUpload'
import ColorPicker from '@/components/misc/form/colorPicker'
import TimePicker from '@/components/misc/form/timePicker'
import Link from 'next/link'
import { createEventAction } from '@/lib/actions/events'
import { toast } from 'sonner'
import { generateTimezones } from '@/lib/utils/time'
import { Loader2 } from 'lucide-react'

export default function CreateEventForm({
  organizationId,
}: {
  organizationId: string
}) {
  const [isCreatingEvent, setIsCreatingEvent] =
    useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      start: new Date(), // Adjust according to your UI component's expected format
      end: new Date(), // Adjust according to your UI component's expected format
      location: '',
      eventCover: '',
      logo: '',
      banner: '',
      organizationId: organizationId,
      timezone: '',
      startTime: '',
      endTime: '',
      accentColor: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreatingEvent(true)
    const response = createEventAction({
      event: values,
    })
      .then((response) => {
        if (response) {
          toast.success('Event created')
        } else {
          toast.error('Error creating event')
        }
      })
      .catch(() => {
        toast.error('Error creating event')
      })
      .finally(() => {
        setIsCreatingEvent(false)
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
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
                <Textarea
                  placeholder="enter your event description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="enter the event location"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-4">
          <div className="flex flex-row w-1/2 space-x-1">
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
          <div className="flex flex-row w-1/2 space-x-1">
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
        <div className="flex flex-row space-x-2">
          <div className="flex w-1/6">
            <FormField
              control={form.control}
              name="logo"
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
              name="banner"
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
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Color</FormLabel>
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
        <div className="flex flex-row">
          <Button variant={'destructive'}>
            <Link href={`/studio/${organizationId}`} passHref>
              Cancel
            </Link>
          </Button>
          {isCreatingEvent ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="ml-2" type="submit">
              Create Event
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
