'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/misc/form/imageUpload'
import { sessionSchema } from '@/lib/schema'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  updateSessionAction,
  deleteSessionAction,
} from '@/lib/actions/sessions'
import { IExtendedSession } from '@/lib/types'
import { Loader2 } from 'lucide-react'

const SessionAccordion = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession
  organizationSlug: string
}) => {
  const router = useRouter()
  const [isUpdatingSession, setIsUpdatingSession] =
    useState<boolean>(false)
  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      description: session.description,
      coverImage: session.coverImage,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsUpdatingSession(true)
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
      .then((response) => {
        if (response) {
          toast.success('Session updated')
        } else {
          toast.error('Error updating session')
        }
      })
      .catch(() => {
        toast.error('Error updating session')
      })
      .finally(() => {
        setIsUpdatingSession(false)
      })
  }

  const handleDeleteSession = (e: any) => {
    e.preventDefault()
    if (
      window.confirm('Are you sure you want to delete this session?')
    ) {
      deleteSessionAction({
        sessionId: session._id!,
        organizationId: session.organizationId as string,
      })
        .then((response) => {
          if (response) {
            toast.success('Session deleted')
            router.push(`/studio/${organizationSlug}?settings=videos`)
          } else {
            toast.error('Error deleting session')
          }
        })
        .catch(() => {
          toast.error('Error deleting session')
        })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                  path={`sessions`}
                  {...field}
                  onChange={field.onChange}
                  aspectRatio={16 / 9}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name={`speakers`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speaker</FormLabel>
              <FormControl>
                <AddSpeakersInput
                  speakers={field.value}
                  eventId={session.eventSlug ?? ''}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playbackId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playback ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        /> */}
        <div className="flex flex-row justify-between space-x-2 ">
          <Button
            onClick={handleDeleteSession}
            variant={'destructive'}
            className="w-full">
            Delete session
          </Button>
          <Button className="w-full" type="submit">
            {isUpdatingSession ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                Please Updating session
              </>
            ) : (
              'Update session'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SessionAccordion
