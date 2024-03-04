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
import { createSessionAction } from '@/lib/actions/sessions'
import { Loader2 } from 'lucide-react'
import { useAccount } from 'wagmi'
import ImageUpload from '@/components/misc/form/imageUpload'
import Dropzone from './Dropzone'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { useRouter } from 'next/navigation'

export default function UploadVideoForm({
  eventId,
  organizationId,
  organizationSlug,
  stageId,
}: {
  eventId: string
  organizationId: string
  organizationSlug: string
  stageId: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
  const router = useRouter()

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      description: '',
      coverImage: '',
      assetId: '',
    },
  })

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
        organizationId,
        speakers: [],
        stageId,
        start: 0,
        end: 0,
      },
    })
      .then((session) => {
        toast.success('Session created')
        setIsLoading(false)
        router.push(
          `/studio/${organizationSlug}/library/${session._id}/edit`
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
        className="flex flex-col w-full h-full">
        <div className="flex flex-row space-x-4 w-full h-full">
          <div className="flex flex-col space-y-8 w-1/2">
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
            {/* <FormField
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
          /> */}
            <FormField
              disabled={!form.getValues('name')}
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">Thumbnail</FormLabel>
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
          </div>
          <div className="flex flex-col w-1/2 h-full">
            <FormField
              disabled={!form.getValues('name')}
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem className="w-full h-full">
                  <FormLabel className="">Video</FormLabel>
                  <FormControl>
                    <Dropzone {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-row space-x-4 items-center justify-between w-full">
          <Button
            onClick={(e) => {
              e.preventDefault()
              router.push(
                `/studio/${organizationSlug}?settings=video`
              )
            }}
            variant="link"
            className="text-black">
            Cancel
          </Button>
          <Button
            disabled={!(form.getValues('assetId') === '')}
            type="submit"
            className=" max-w-[150px] ml-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Create video'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
