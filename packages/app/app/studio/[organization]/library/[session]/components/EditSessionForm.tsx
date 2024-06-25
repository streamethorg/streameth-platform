'use client'

import { useState } from 'react'
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
import {
  Loader2,
  Trash2,
  Earth,
  Lock,
  ChevronDown,
} from 'lucide-react'
import { IExtendedSession } from '@/lib/types'
import { updateSessionAction } from '@/lib/actions/sessions'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import DeleteAsset from '../../components/DeleteAsset'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/misc/form/imageUpload'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRouter } from 'next/navigation'

const EditSessionFrom = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession
  organizationSlug: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
        router.push(`/studio/${organizationSlug}/library`)
      })
  }

  return (
    <Form {...form}>
      <form
        onError={(errors) => {
          console.error('Error:', errors)
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Video title <span className="text-red-500">*</span>
              </FormLabel>
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
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
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
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <div className="flex justify-start items-center space-x-2">
                  {field.value ? (
                    <>
                      <Earth size={16} />
                      <p>Public</p>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <p>Private</p>
                    </>
                  )}
                  <Popover>
                    <PopoverTrigger>
                      <ChevronDown size={20} />
                    </PopoverTrigger>
                    <PopoverContent className="flex justify-start items-center space-x-2 transition-colors cursor-pointer hover:bg-gray-200 w-[150px] z-[999999999999999]">
                      {!field.value ? (
                        <>
                          <Earth size={16} />
                          <p>Make Public</p>
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          <p>Make Private</p>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
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

        <div className="flex items-end justify-end space-x-2">
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
              'Update details'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditSessionFrom
