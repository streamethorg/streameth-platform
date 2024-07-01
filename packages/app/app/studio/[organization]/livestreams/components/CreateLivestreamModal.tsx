'use client'

import DatePicker from '@/components/misc/form/datePicker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createStageAction } from '@/lib/actions/stages'
import { StageSchema } from '@/lib/schema'
import { IExtendedOrganization } from '@/lib/types'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import CreateLivestreamOptions from './CreateLivestreamOptions'
import TimePicker from '@/components/misc/form/timePicker'
import { formatDate } from '@/lib/utils/time'
import ImageUpload from '@/components/misc/form/imageUpload'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CameraIcon } from 'lucide-react'

const CreateLivestreamModal = ({
  organization,
  show,
}: {
  show?: boolean
  organization: IExtendedOrganization
}) => {
  const [open, setOpen] = useState(show ?? false)
  const [isMultiDate, setIsMultiDate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [streamType, setStreamType] = useState<
    'instant' | 'schedule' | undefined
  >()
  const router = useRouter()

  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: '',
      organizationId: organization?._id,
      streamDate: new Date(),
      streamTime: '',
      streamEndDate: new Date(),
      streamEndTime: '',
      isMultipleDate: isMultiDate,
    },
  })

  const { watch } = form
  const streamDate = watch('streamDate')
  const streamTime = watch('streamTime')
  const streamEndDate = watch('streamEndDate')
  const streamEndTime = watch('streamEndTime')

  const handleModalClose = () => {
    setOpen(false)
    setStreamType(undefined)
    setIsMultiDate(false)
    form.reset()
  }

  const parseDate = (date?: Date, time?: string) => {
    return new Date(
      `${formatDate(date || new Date(), 'YYYY-MM-DD')}T${
        time || '00:00'
      }`
    )
  }

  const formattedDate = parseDate(streamDate, streamTime)
  const formattedEndDate = parseDate(streamEndDate, streamEndTime)

  const isPast = formattedDate < new Date()
  const validateEndDate = formattedEndDate < formattedDate
  const isScheduleFormDisable = !streamDate || !streamTime || isPast

  const isSchedule = streamType === 'schedule'

  function onSubmit(values: z.infer<typeof StageSchema>) {
    setIsLoading(true)
    let streamId: string | undefined
    // destructure and omit streamTime from the payload
    const { streamTime, streamEndTime, ...otherValues } = values
    createStageAction({
      stage: {
        ...otherValues,
        streamDate: isSchedule ? formattedDate : new Date(),
        streamEndDate: isMultiDate ? formattedEndDate : new Date(),
        isMultipleDate: isMultiDate,
      },
    })
      .then((response) => {
        toast.success(
          `Stream ${!isSchedule ? 'created' : 'scheduled'}`
        )
        streamId = response?._id as string

        router.push(
          `/studio/${organization?.slug}/livestreams/${streamId}`
        )
      })
      .catch(() => {
        toast.error('Error creating stream')
        setIsLoading(false)
      })
      .finally(() => {
        setIsLoading(false)
        handleModalClose()
      })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
        setStreamType(undefined)
      }}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="h-auto w-fit flex flex-row bg-white px-2 justify-start rounded-xl border space-x-4 items-center">
          <div className="p-4 border bg-primary rounded-xl text-white">
            <CameraIcon className="h-6" />
          </div>
          <span className="">Create Livestream</span>
        </Button>
      </DialogTrigger>
      {!streamType ? (
        <CreateLivestreamOptions setStreamType={setStreamType} />
      ) : (
        <DialogContent className="sm:max-w-[450px] bg-white overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {!isSchedule ? 'Create' : 'Schedule'} livestream
            </DialogTitle>
            <DialogDescription>
              Newly created streams are assigned a special key and
              RTMP ingest URL to stream into.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Stream name</FormLabel>
                    <FormControl>
                      <Input
                        max={30}
                        placeholder="e.g. My first livestream"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem className="flex p-1 aspect-video mt-4">
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <ImageUpload
                        placeholder="Drag or click to upload image here. Maximum image file size is 20MB. Best resolution of 1920 x 1080. Aspect ratio of 16:9. "
                        className="w-full h-full bg-neutrals-300 text-black m-auto"
                        aspectRatio={1}
                        path={`livestreams/${organization?.slug}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSchedule && (
                <>
                  <div className="mt-6">
                    <p
                      className="text-sm"
                      onClick={() => setIsMultiDate(!isMultiDate)}>
                      Streaming multiple days?
                    </p>
                    <div className="flex items-center gap-5 mt-1">
                      <div className="flex items-center gap-1">
                        <Checkbox
                          checked={isMultiDate}
                          onCheckedChange={() => setIsMultiDate(true)}
                        />
                        <Label>Yes</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Checkbox
                          defaultChecked
                          onCheckedChange={() =>
                            setIsMultiDate(!isMultiDate)
                          }
                          checked={!isMultiDate}></Checkbox>
                        <Label>No</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <FormField
                      control={form.control}
                      name="streamDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel required>
                            Stream {isMultiDate ? 'Start' : ''} Date
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value as Date}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streamTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel required>
                            Stream {isMultiDate ? 'Start' : ''} Time
                          </FormLabel>
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
                  {isPast && (
                    <p className="text-destructive text-[12px] mt-1">
                      Couldn&apos;t schedule. The date and time
                      selected are too far in the past.
                    </p>
                  )}
                  {isMultiDate && (
                    <>
                      <div className="flex space-x-3 mt-4">
                        <FormField
                          control={form.control}
                          name="streamEndDate"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel required>
                                Stream End Date
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value as Date}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="streamEndTime"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel required>
                                Stream End Time
                              </FormLabel>
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
                      {validateEndDate && (
                        <p className="text-destructive text-[12px] mt-1">
                          Couldn&apos;t schedule. End date and time
                          selected are too far in the past.
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
              <DialogFooter className="mt-8">
                <Button onClick={handleModalClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  variant="outlinePrimary"
                  disabled={
                    getFormSubmitStatus(form) ||
                    isLoading ||
                    (isSchedule && isScheduleFormDisable)
                  }
                  type="submit">
                  {!isSchedule ? 'Create' : 'Schedule'} livestream
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default CreateLivestreamModal
