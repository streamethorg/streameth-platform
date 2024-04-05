'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { sessionSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { createSessionAction } from '@/lib/actions/sessions'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/misc/form/imageUpload'
import Dropzone from './Dropzone'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { DialogClose } from '@/components/ui/dialog'
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface'

const UploadVideoForm = ({
  stageId,
  eventId,
  organizationId,
  onFinish,
}: {
  stageId?: string
  eventId?: string
  organizationId: string
  onFinish: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef(new AbortController())

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      description: '',
      coverImage: '',
      assetId: '',
    },
  })

  const handleCancel = () => {
    abortControllerRef.current.abort()
  }

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsLoading(true)

    createSessionAction({
      session: {
        ...values,
        organizationId,
        speakers: [],
        start: 0,
        end: 0,
        type: SessionType.video,
        eventId: eventId || '',
        stageId: stageId || '',
      },
    })
      .then(() => onFinish())
      .catch((e) => {
        console.log(e)
        toast.error('Error creating Session')
      })
      .finally(() => {
        setIsLoading(false)
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
              <FormLabel>Video title *</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
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
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={!form.getValues('name')}
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem className="max-h-[80px]">
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUpload
                  aspectRatio={16 / 9}
                  path={`organizations/${eventId}
                    )}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={!form.getValues('name')}
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Dropzone
                  {...field}
                  abortControllerRef={abortControllerRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <DialogClose>
            <Button
              variant="secondary"
              className="text-black border-2"
              onClick={() => handleCancel()}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={getFormSubmitStatus(form) || isLoading}
            variant={'primary'}
            type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <p className="text-white">Create asset</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UploadVideoForm
