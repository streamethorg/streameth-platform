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
import { apiUrl } from '@/lib/utils/utils'
import moment from 'moment-timezone'
import Combobox from '@/components/ui/combo-box'
import ImageUpload from '@/components/misc/form/imageUpload'
import ColorPicker from '@/components/misc/form/colorPicker'
import TimePicker from '@/components/misc/form/timePicker'
import Link from 'next/link'

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
      eventName: '',
      organizationId: organizationId,
      eventDescription: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      eventLocation: '',
      eventLogo: '',
      eventBanner: '',
      eventColor: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await fetch(`${apiUrl()}/events`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

    const data = await response.json()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
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
                  placeholder="enter your event description"
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
          <div className="flex flex-row w-1/2 space-x-1">
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
        <div className="flex flex-row space-x-2">
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
          <Button className="ml-auto" type="submit">
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}

function generateTimezones() {
  const timezones = moment.tz.names()
  return timezones.map((timezone) => ({
    label: timezone,
    value: timezone,
  }))
}
