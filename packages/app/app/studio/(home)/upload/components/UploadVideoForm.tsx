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
import { sessionSchema, videoUploadSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/misc/form/imageUpload'
import { useAccount } from 'wagmi'
import { generateId } from 'streameth-new-server/src/utils/util'
import { Card, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import InfoHoverCard from './InfoHoverCard'
import { apiUrl } from '@/lib/utils/utils'
import { getCookie } from '@/lib/actions/cookieConsent'

export default function UploadVideoForm() {
  const [isLoading, setIsLoading] = useState(false)
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

  async function onSubmit(values: z.infer<typeof videoUploadSchema>) {
    setIsLoading(true)
    if (!address) {
      toast.error('No wallet address found')
      return
    }

    // TODO: Get session
    const sessionId = '65d382e3ad51d4af4f44758b'
    const googleToken = await getCookie('google_token')

    // TODO: It should first be uploaded to Livepeer before uploading to YouTube
    if (values.uploadYoutube === true && googleToken) {
      const response = await fetch(
        `${apiUrl()}/sessions/upload/${sessionId}?googleToken=${
          googleToken.value
        }`
      )
      if (!response.ok) {
        throw new Error(`Something went wrong ${response.status}`)
      }
      console.log('All good')
    }

    // TODO: How should I link a session to a video? Or should it create a new video?
    // updateSession({ session: {...session, name: values.name }, authToken: '' })
    //   .then(() => {
    //     toast.success('Video created')
    //   })
    //   .catch(() => {
    //     toast.error('Error uploading a video')
    //   })
    //   .finally(() => {
    //     setIsLoading(false)
    //   })
  }

  const isSubmitDisabled =
    form.formState.isSubmitting ||
    !form.formState.isValid ||
    Object.keys(form.formState.dirtyFields).length === 0

  return (
    <Card className="p-4 bg-gray-100">
      <CardTitle>Fill in the information of the video</CardTitle>
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
            render={({
              field: { onChange, onBlur, value, name, ref },
            }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="uploadYoutube"
                      name={name}
                      ref={ref}
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="uploadYoutube"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Upload to YouTube...
                  </FormLabel>
                  <InfoHoverCard
                    title={'Upload this video to YouTube'}
                    description={
                      'Linking your YouTube Channel to StreamETH enables automated video uploads, streamlining the content sharing process.'
                    }
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
                Please wait
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
