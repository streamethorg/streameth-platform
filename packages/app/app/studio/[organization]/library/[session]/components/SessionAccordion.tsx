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
import { IExtendedSession, IExtendedState } from '@/lib/types'
import { Loader2, Youtube } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { apiUrl } from '@/lib/utils/utils'

const SessionAccordion = ({
  session,
  organizationSlug,
  googleToken,
  videoState,
}: {
  session: IExtendedSession
  organizationSlug: string
  googleToken: RequestCookie | undefined
  videoState: IExtendedState
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
      youtubeUpload: session.youtubeUpload,
    },
  })

  const handleLogin = async () => {
    const response = await fetch('/api/google/oauth2', {
      cache: 'no-store',
    })
    if (!response.ok) {
      throw new Error(await response.text())
    }
    const url = await response.json()
    console.log(url)
  }

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
        if (googleToken && values.youtubeUpload) {
          console.log('Got a token...')
          fetch(`${apiUrl}/upload/${session._id.toString()}`, {
            method: 'POST',
          }).catch((e) => {
            console.log(e)
            toast.error('Error uploading to YouTube')
          })
        }
        console.log('Got no token...')

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
        organizationId: session.organizationId as string,
        sessionId: session._id!,
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
        <FormField
          control={form.control}
          name="youtubeUpload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload to YouTube</FormLabel>
              <FormControl>
                {googleToken ? (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={field.value}
                    aria-readonly
                  />
                ) : (
                  <div className="flex justify-between">
                    <h1>
                      Please login with your Google Account to upload
                      to YouTube
                    </h1>
                    <Youtube
                      className="cursor-pointer"
                      onClick={handleLogin}
                    />
                  </div>
                )}
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
