'use client'

import DatePicker from '@/components/misc/form/datePicker'
import ImageUpload from '@/components/misc/form/imageUpload'
import TimePicker from '@/components/misc/form/timePicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
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
import { Label } from '@/components/ui/label'
import { updateStageAction } from '@/lib/actions/stages'
import { StageSchema } from '@/lib/schema'
import { IExtendedStage } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import { getFormSubmitStatus, getTimeString } from '@/lib/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { FilePenLine } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const EditLivestream = ({
  stage,
  organizationSlug,
  btnText = 'Edit',
  variant = 'ghost',
}: {
  stage: IExtendedStage
  organizationSlug: string
  btnText?: string
  variant?:
    | 'outline'
    | 'ghost'
    | 'primary'
    | 'default'
    | 'link'
    | 'secondary'
}) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMultiDate, setIsMultiDate] = useState(
    stage?.isMultipleDate
  )
  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: stage?.name,
      organizationId: stage?.organizationId as string,
      streamDate: new Date(stage?.streamDate as string) || new Date(),
      thumbnail: stage?.thumbnail,
      streamTime: getTimeString(stage.streamDate) || '00:00',
      streamEndDate:
        new Date(stage?.streamEndDate as string) || new Date(),
      streamEndTime: getTimeString(stage.streamEndDate) || '00:00',
      isMultipleDate: stage?.isMultipleDate || false,
    },
  })

  const handleModalClose = () => {
    setOpen(false)
  }

  const dateInput = formatDate(
    new Date(`${form.getValues('streamDate')}`),
    'YYYY-MM-DD'
  )
  const timeInput = form.getValues('streamTime')
  const formattedDate = new Date(`${dateInput}T${timeInput}`)
  const formattedEndDate = new Date(
    new Date(
      `${formatDate(
        new Date(`${form.getValues('streamEndDate')}`),
        'YYYY-MM-DD'
      )}T${form.getValues('streamEndTime')}`
    )
  )
  const isPast = formattedDate < new Date()
  const validateEndDate = formattedEndDate < formattedDate

  function onSubmit(values: z.infer<typeof StageSchema>) {
    setIsLoading(true)
    const { streamTime, streamEndTime, ...otherValues } = values

    updateStageAction({
      stage: {
        ...otherValues,
        streamDate: formattedDate,
        streamEndDate: formattedEndDate,
        isMultipleDate: isMultiDate,
        _id: stage._id,
      },
    })
      .then(() => {
        toast.success(`Stream updated`)
      })
      .catch(() => {
        toast.error('Error updating stream')
      })
      .finally(() => {
        setIsLoading(false)
        handleModalClose()
      })
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full" asChild>
        <Button className="flex space-x-2 w-full" variant={variant}>
          <FilePenLine size={15} />
          <span>{btnText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit livestream Details</DialogTitle>
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
                <FormItem className="flex p-1 mt-4 aspect-video">
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <ImageUpload
                      placeholder="Click to upload image here. Maximum image file size is 20MB.
                        Best resolution of 1920 x 1080. Aspect ratio of 16:9. "
                      className="m-auto w-full h-full text-black bg-neutrals-300"
                      aspectRatio={1}
                      path={`stages/${organizationSlug}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6">
              {' '}
              <p
                className="text-sm"
                onClick={() => setIsMultiDate(!isMultiDate)}>
                Streaming multiple days?
              </p>{' '}
              <div className="flex gap-5 items-center mt-1">
                <div className="flex gap-1 items-center">
                  <Checkbox
                    checked={isMultiDate}
                    onCheckedChange={() => setIsMultiDate(true)}
                  />
                  <Label>Yes</Label>
                </div>
                <div className="flex gap-1 items-center">
                  <Checkbox
                    onCheckedChange={() =>
                      setIsMultiDate(!isMultiDate)
                    }
                    checked={!isMultiDate}></Checkbox>
                  <Label>No</Label>
                </div>
              </div>
            </div>
            <div className="flex mt-4 space-x-3">
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
              <p className="mt-1 text-destructive text-[12px]">
                Couldn&apos;t schedule. The date and time selected are
                too far in the past.
              </p>
            )}

            {isMultiDate && (
              <>
                <div className="flex mt-4 space-x-3">
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
                  <p className="mt-1 text-destructive text-[12px]">
                    Couldn&apos;t schedule. End date and time selected
                    are too far in the past.
                  </p>
                )}
              </>
            )}

            <DialogFooter className="mt-8">
              <Button
                type="button"
                onClick={handleModalClose}
                variant="outline">
                Cancel
              </Button>

              <Button
                loading={isLoading}
                variant="primary"
                disabled={getFormSubmitStatus(form) || isLoading}
                type="submit">
                Update livestream
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditLivestream
