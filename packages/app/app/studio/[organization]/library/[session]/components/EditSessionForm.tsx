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
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/misc/form/imageUpload'
import { generateId } from 'streameth-new-server/src/utils/util'
import { IExtendedSession } from '@/lib/types'
import { updateSessionAction } from '@/lib/actions/sessions'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import DeleteAsset from '../../../components/library/DeleteAsset'

const EditSessionFrom = ({
  session,
}: {
  session: IExtendedSession
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
        onError={(errors) => {
          alert(errors)
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
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
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem className="w-96 h-52">
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUpload
                  aspectRatio={1}
                  path={`session/${generateId(
                    form.getValues('name')
                  )}`}
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
            href={`/studio/${session.organizationId}/library`}
            showIcon={false}
          />
          <Button
            disabled={getFormSubmitStatus(form) || isLoading}
            type="submit">
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
