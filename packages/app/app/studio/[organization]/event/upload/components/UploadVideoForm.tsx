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
import { videoUploadSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/misc/form/imageUpload'
import { useAccount } from 'wagmi'
import { generateId } from 'streameth-new-server/src/utils/util'
import { Card, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { apiUrl } from '@/lib/utils/utils'
import InfoHoverCard from '@/components/misc/interact/InfoHoverCard'
import { getCookie, hasCookie } from '@/lib/actions/cookieConsent'
import {
  getVideoPhaseAction,
  getVideoUrlAction,
} from '@/lib/actions/livepeer'
import { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { updateSessionAction } from '@/lib/actions/sessions'
import { AssetPhase } from 'livepeer/dist/models/components'
import { useRouter } from 'next/navigation'

const UploadVideoForm = ({
  session,
  organization,
  progress,
}: {
  session: ISession
  organization: string
  progress: number
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [cookie, setCookie] = useState(false)
  const { address } = useAccount()
  const form = useForm<z.infer<typeof videoUploadSchema>>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      name: '',
      description: '',
      coverImage: '',
      uploadYoutube: false,
    },
  })

  useEffect(() => {
    const fetchCookie = async () => {
      const cookie = await hasCookie('google_token')
      setCookie(cookie)
    }

    fetchCookie()
  }, [])

  const onSubmit = (values: z.infer<typeof videoUploadSchema>) => {
    setIsLoading(true)
    if (!address) {
      toast.error('No wallet address found')
      return
    }

    const intervalId = setInterval(
      async () => {
        const phase: AssetPhase = (await getVideoPhaseAction(
          session.assetId!
        )) as AssetPhase
        if (phase === AssetPhase.Processing) {
          console.log('videoUrl does not exist')
          return
        } else if (phase === AssetPhase.Failed) {
          clearInterval(intervalId)
          // TODO: Show that it failed
          return
        }

        const videoUrl = await getVideoUrlAction(session.assetId!)
        updateSessionAction({
          session: {
            name: values.name,
            description: values.description,
            coverImage: values.coverImage,
            _id: session._id!.toString(),
            organizationId: session.organizationId,
            eventId: session.eventId,
            stageId: session.stageId,
            start: session.start ?? Number(new Date()),
            end: session.end ?? Number(new Date()),
            speakers: session.speakers ?? [],
            videoUrl: videoUrl!,
          },
        })
          .then(async () => {
            toast.success('Video updated...')
            const googleToken = await getCookie('google_token')

            if (
              videoUrl &&
              values.uploadYoutube === true &&
              googleToken
            ) {
              const response = await fetch(
                `${apiUrl()}/sessions/upload/${session._id!.toString()}?googleToken=${
                  googleToken.value
                }`,
                { method: 'POST' }
              )
              if (!response.ok) {
                throw new Error(
                  `Something went wrong ${response.status}`
                )
              }
            }
          })
          .catch(() => {
            toast.error('Error uploading a video')
          })
          .finally(() => {
            console.log('Redirecting...')
            router.push(
              `/studio/${organization}/library/${session._id?.toString()}/edit`
            )
          })
        clearInterval(intervalId)
      },
      1000 * 1 * 5 // 5 Seconds
    )
  }

  const isSubmitDisabled =
    form.formState.isSubmitting ||
    !form.formState.isValid ||
    Object.keys(form.formState.dirtyFields).length === 0 ||
    progress < 100

  return (
    <Card className="p-4 bg-gray-200">
      <CardTitle className="my-2">
        Fill in the information of the video
      </CardTitle>
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
                <FormLabel className="">Video title</FormLabel>
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
              <FormItem className="">
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Input placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uploadYoutube"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!cookie}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="uploadYoutube"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Upload this video to YouTube...
                  </FormLabel>
                  <InfoHoverCard
                    title={'Upload this video to YouTube'}
                    description={
                      'Linking your YouTube Channel to StreamETH enables automated video uploads, streamlining the content sharing process.'
                    }
                    size={18}
                  />
                </div>
              </FormItem>
            )}
          />
          <FormField
            disabled={!form.getValues('name')}
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem className="max-w-[50px]">
                <FormLabel className="">Thumbnail</FormLabel>
                <FormControl>
                  <ImageUpload
                    aspectRatio={1}
                    path={`organizations/${generateId(
                      form.getValues('coverImage')
                    )}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitDisabled} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />{' '}
                Please wait...
              </>
            ) : (
              'Add information to video...'
            )}
          </Button>
        </form>
      </Form>
    </Card>
  )
}

export default UploadVideoForm
