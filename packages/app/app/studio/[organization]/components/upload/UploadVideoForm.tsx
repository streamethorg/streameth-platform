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
import { useAccount } from 'wagmi'
import ImageUpload from '@/components/misc/form/imageUpload'
import Dropzone from './Dropzone'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { useRouter } from 'next/navigation'
import { DialogClose } from '@radix-ui/react-dialog'

const UploadVideoForm = ({
  eventId,
  organization,
  organizationSlug,
}: {
  eventId?: string
  organization: string
  organizationSlug: string
}) => {
  const router = useRouter()
  const { address } = useAccount()
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
    if (!address) {
      toast.error('No wallet address found')
      return
    }
    createSessionAction({
      session: {
        ...values,
        eventId,
        organizationId: organization,
        speakers: [],
        start: 0,
        end: 0,
      },
    } as any)
      .then((session) => {
        toast.success('Session created')
        setIsLoading(false)
        router.push(
          `/studio/${organizationSlug}/library/${session._id}`
        )
      })
      .catch((e) => {
        console.log(e)
        toast.error('Error creating Session')
      })
  }

  return (
    <Form {...form}>
      <form
        onError={(errors) => {
          alert(errors)
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  {...field}
                  className="bg-gray-200"
                />
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
              <FormLabel className="">Description *</FormLabel>
              <FormControl>
                <Input
                  placeholder="description"
                  {...field}
                  className="bg-gray-200"
                />
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
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUpload
                  aspectRatio={16 / 9}
                  path={`organizations/${eventId}
                    )}`}
                  {...field}
                  className="bg-gray-200"
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
        <div className="flex justify-end">
          <DialogClose>
            <Button
              variant="secondary"
              className="text-black"
              onClick={() => handleCancel()}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={
              !form.getValues('assetId') ||
              getFormSubmitStatus(form) ||
              isLoading
            }
            variant={'primary'}
            type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Create asset'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UploadVideoForm
