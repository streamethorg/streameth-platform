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
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const EditLivestream = ({
  livestream,
  organizationSlug,
}: {
  organizationSlug: string
  livestream: IExtendedStage
}) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMultiDate, setIsMultiDate] = useState(
    livestream?.isMultipleDate
  )
  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: livestream?.name,
      organizationId: livestream?.organizationId as string,
      streamDate:
        new Date(livestream?.streamDate as string) || new Date(),
      thumbnail: livestream?.thumbnail,
      streamTime: getTimeString(livestream.streamDate) || '00:00',
      streamEndDate:
        new Date(livestream?.streamEndDate as string) || new Date(),
      streamEndTime:
        getTimeString(livestream.streamEndDate) || '00:00',
      isMultipleDate: livestream?.isMultipleDate || false,
    },
  })
  console.log(livestream)
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
        _id: livestream._id,
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
      <DialogTrigger>
        <Button variant="link"> 
        
        Edit</Button>
      </DialogTrigger>
      <DialogContent>
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
                <FormItem className="flex p-1 aspect-video mt-4">
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <ImageUpload
                      placeholder="Drag or click to upload image here. Maximum image file size is 20MB.
                        Best resolution of 1920 x 1080. Aspect ratio of 16:9. "
                      className="w-full h-full bg-neutrals-300 text-black m-auto"
                      aspectRatio={1}
                      path={`livestreams/${organizationSlug}`}
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
                Couldn&apos;t schedule. The date and time selected are
                too far in the past.
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
                Edit livestream
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditLivestream
