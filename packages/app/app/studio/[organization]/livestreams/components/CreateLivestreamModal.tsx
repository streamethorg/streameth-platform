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

const CreateLivestreamModal = ({
  organization,
  show,
}: {
  show?: boolean
  organization: IExtendedOrganization
}) => {
  const [open, setOpen] = React.useState(show ?? false)
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
    },
  })

  const handleModalClose = () => {
    setOpen(false)
    setStreamType(undefined)
    form.reset()
  }

  const dateInput = formatDate(
    new Date(`${form.getValues('streamDate')}`),
    'YYYY-MM-DD'
  )
  const timeInput = form.getValues('streamTime')
  const formattedDate = new Date(`${dateInput}T${timeInput}`)
  const isPast = formattedDate < new Date()
  const isScheduleFormDisable =
    !form.getValues('streamDate') ||
    !form.getValues('streamTime') ||
    isPast
  const isSchedule = streamType === 'schedule'

  function onSubmit(values: z.infer<typeof StageSchema>) {
    setIsLoading(true)
    let streamId: string | undefined
    // destructure and omit streamTime from the payload
    const { streamTime, ...otherValues } = values
    createStageAction({
      stage: {
        ...otherValues,
        streamDate: isSchedule ? formattedDate : new Date(),
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
      })
      .finally(() => {
        setIsLoading(false)
        handleModalClose()
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Create Livestream</Button>
      </DialogTrigger>
      {!streamType ? (
        <CreateLivestreamOptions setStreamType={setStreamType} />
      ) : (
        <DialogContent className="sm:max-w-[425px] bg-white">
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
                        placeholder="e.g. My first livestream"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSchedule && (
                <>
                  <div className="flex space-x-3 mt-8">
                    <FormField
                      control={form.control}
                      name="streamDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel required>Stream Date</FormLabel>
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
                          <FormLabel required>Stream Time</FormLabel>
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
                </>
              )}

              <DialogFooter className="mt-8">
                <Button onClick={handleModalClose} variant="outline">
                  Cancel
                </Button>

                <Button
                  loading={isLoading}
                  variant="primary"
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
