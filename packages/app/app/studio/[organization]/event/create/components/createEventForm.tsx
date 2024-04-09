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
  const [stage, setStage] = useState<number>(0)
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
          router.push(`/studio/${organization?.slug}/event/${response._id}`)
          router.refresh()
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
      <Card className="border max-w-4xl w-full relative rounded-2xl bg-white shadow-none">
        <CardHeader className="border-b flex flex-row justify-between items-center">
          <p className="text-3xl">Create an event</p>
          <div className="flex flex-row justify-between w-full  max-w-[300px]">
            {[
              { stage: 0, name: 'Details' },
              { stage: 1, name: 'Design' },
              { stage: 2, name: 'Design' },
            ].map((i, index) => (
              <div
                className="relative w-full flex flex-col"
                key={i.stage}>
                <div
                  onClick={() => setStage(i.stage)}
                  className={`text-white z-50  cursor-pointer mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                    stage === i.stage
                      ? 'bg-green-500'
                      : 'bg-secondary'
                  }`}>
                  {i.stage + 1}
                </div>
                {(i.stage === 0 || i.stage === 2) && (
                  <div
                    className={`${
                      i.stage === 2 ? 'right-0 ' : 'left-0'
                    } z-40 absolute top-0 w-1/2 h-full bg-white`}></div>
                )}
                <hr className="z-[0] top-[15px] w-full  bg-black absolute" />
                <p
                  className={`z-50 mx-auto ${
                    stage === i.stage ? 'text-black' : 'text-muted'
                  }`}>
                  {i.name}
                </p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="'p-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className="space-y-8 p-4"
              style={
                stage !== 0
                  ? { display: 'none' }
                  : {
                      display: 'block',
                    }
              }
              id="section1">
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
                        style={{
                          width: '100%',
                          backgroundColor: '#F8FAFC',
                          borderColor: '#E2E8F0',
                        }}
                        value={field.value}
                        onChange={(a) => field.onChange(a)}
                      />
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
                          variant="outline"
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
              <div className="items-end justify-end flex flex-row space-x-2">
                <Button
                  variant={'outline'}
                  onClick={() => setStage(stage - 1)}>
                  Back
                </Button>

                <Button
                  variant={'primary'}
                  onClick={(e) => {
                    e.preventDefault()
                    setStage(stage + 1)
                  }}>
                  Next
                </Button>
              </div>
            </div>
            <div
              id="section2"
              style={
                stage !== 1
                  ? { display: 'none' }
                  : {
                      display: 'block',
                    }
              }
              className="space-y-4 p-4">
              <div className="flex flex-row space-x-2">
                <div className="flex w-1/3">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-[150px]">
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
                <div className="flex w-2/3 ">
                  <FormField
                    control={form.control}
                    name="eventCover"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-[320px]">
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
              </div>
              <div className="flex w-full">
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[600px]">
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
              <FormField
                control={form.control}
                name="accentColor"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[600px]">
                    <FormLabel>Event Accent Color</FormLabel>
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
              <div className="flex flex-row justify-end">
                <Button
                  variant={'outline'}
                  onClick={(e) => {
                    e.preventDefault()
                    setStage(stage - 1)
                  }}>
                  Back
                </Button>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  )
}
