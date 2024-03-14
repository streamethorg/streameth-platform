'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '@/lib/schema'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import MDEditor from '@uiw/react-md-editor'
import { IExtendedOrganization } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getFormSubmitStatus } from '@/lib/utils/utils'

export default function CreateEventForm({
  organization,
}: {
  organization: IExtendedOrganization
}) {
  const [isCreatingEvent, setIsCreatingEvent] =
    useState<boolean>(false)
  const router = useRouter()

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
      timezone: '',
      startTime: '',
      endTime: '',
      accentColor: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.start > values.end) {
      toast.error('Start date must be before the end date')
      setIsCreatingEvent(false)
      return
    }
    setIsCreatingEvent(true)
    const response = createEventAction({
      event: { ...values, organizationId: organization?._id },
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
        router.push(`/studio/${organization?.slug}`)
        router.refresh()
      })
  }

  return (
    <Form {...form}>
      <Card className="max-w-4xl w-full relative border-none rounded-lg bg-white shadow-none h-full">
        <CardHeader className="h-[88px]">
          <CardTitle className="flex flex-row justify-between items-center">
            <p>Create an event for {organization.name}</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-88px)] overflow-auto">
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
                    <div className="container">
                      <MDEditor
                        value={field.value}
                        onChange={(a) => field.onChange(a)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row space-x-4 w-full">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="w-1/2">
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
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="w-1/2">
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
            </div>
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
                          path={`events/${organization?.slug}`}
                          aspectRatio={1}
                          {...field}
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
                          path={`events/${organization?.slug}`}
                          {...field}
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
                          path={`events/${organization?.slug}`}
                          {...field}
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
                <FormItem className="w-full">
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
            <div className="flex flex-row justify-between">
              <Link href={`/studio/${organization.slug}`} passHref>
                Cancel
              </Link>
              <Button
                disabled={getFormSubmitStatus(form)}
                className="ml-2"
                type="submit">
                {isCreatingEvent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Please wait
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  )
}
