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
import { createOrganizationAction } from '@/lib/actions/organizations'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/misc/form/imageUpload'
import { useAccount } from 'wagmi'
import { generateId } from 'streameth-new-server/src/utils/util'
import { Card, CardTitle } from '@/components/ui/card'

export default function UploadVideoForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
  const form = useForm<z.infer<typeof videoUploadSchema>>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      name: '',
      description: '',
      thumbnail: '',
      uploadYoutube: false,
    },
  })

  function onSubmit(values: z.infer<typeof videoUploadSchema>) {
    setIsLoading(true)
    if (!address) {
      toast.error('No wallet address found')
      return
    }
    createOrganizationAction({
      video: { ...values, walletAddress: address as string },
    })
      .then(() => {
        toast.success('Video created')
      })
      .catch(() => {
        toast.error('Error uploading a video')
      })
      .finally(() => {
        setIsLoading(false)
      })
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
            disabled={!form.getValues('name')}
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="max-w-[50px]">
                <FormLabel className="">Thumbnail</FormLabel>
                <FormControl>
                  <ImageUpload
                    aspectRatio={1}
                    path={`organizations/${generateId(
                      form.getValues('thumbnail')
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
