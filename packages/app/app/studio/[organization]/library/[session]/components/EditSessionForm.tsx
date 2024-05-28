'use client'

import { useEffect, useState } from 'react'
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
import { Loader2, Trash2 } from 'lucide-react'
import ImageDropzone from './ImageDropzone'
import { generateId } from 'streameth-new-server/src/utils/util'
import { IExtendedSession } from '@/lib/types'
import { updateSessionAction } from '@/lib/actions/sessions'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import DeleteAsset from '../../components/DeleteAsset'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/misc/form/imageUpload'

const EditSessionFrom = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession
  organizationSlug: string
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      description: session.description,
      coverImage: session.coverImage,
      assetId: session.assetId,
    },
  })

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsLoading(true)

    updateSessionAction({
      session: {
        ...values,
        _id: session._id,
        organizationId: session.organizationId,
        eventId: session.eventId,
        stageId: session.stageId,
        start: session.start ?? Number(new Date()),
        end: session.end ?? Number(new Date()),
        speakers: session.speakers ?? [],
        type: session.type,
      },
    })
      .then(() => toast.success('Session updated'))
      .catch(() => toast.error('Error updating session'))
      .finally(() => {
        setIsLoading(false)
        window.location.reload()
      })
  }

  return (
    <Form {...form}>
      <form
        onError={(errors) => {}}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video title *</FormLabel>
              <FormControl>
                <Input
                  className={
                    'bg-white border border-gray-300 rounded-md'
                  }
                  placeholder="name"
                  {...field}
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
            <FormItem className="h-50">
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  className={
                    'bg-white border border-gray-300 rounded-md'
                  }
                  placeholder="description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUpload
                  className="relative rounded-xl aspect-video max-w-[480px] bg-neutrals-300"
                  aspectRatio={16 / 9}
                  path={`sessions/${organizationSlug}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <DeleteAsset
            session={session}
            href={`/studio/${organizationSlug}/library`}
            TriggerComponent={
              <Button
                variant={'destructive-outline'}
                className="space-x-2 hover:bg-gray-100">
                <Trash2 />
                <p>Delete video</p>
              </Button>
            }
          />
          <Button
            disabled={getFormSubmitStatus(form) || isLoading}
            type="submit"
            variant={'primary'}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Update video'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditSessionFrom
