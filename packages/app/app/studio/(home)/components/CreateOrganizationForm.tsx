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

import { organizationSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { createOrganizationAction } from '@/lib/actions/organizations'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/misc/form/imageUpload'
import { useAccount } from 'wagmi'
import { generateId } from 'streameth-new-server/src/utils/util'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { useRouter } from 'next/navigation'
export default function CreateOrganizationForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      banner: '',
      logo: '',
      email: '',
      bio: '',
    },
  })

  function onSubmit(values: z.infer<typeof organizationSchema>) {
    setIsLoading(true)
    if (!address) {
      toast.error('No wallet address found')
      return
    }
    createOrganizationAction({
      organization: { ...values, walletAddress: address as string },
    })
      .then(() => {
        setIsOpen(false)
        toast.success('Organization created')
      })
      .catch(() => {
        toast.error('Error creating organization')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Form {...form}>
      <form
        onError={(errors) => {}}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <ImageUpload
                    className="w-full h-40 rounded-xl bg-neutrals-300 "
                    placeholder="Drag or click to upload image here. Maximum image file size is 20MB.
                    Best resolution of 1584 x 396px. Aspect ratio of 4:1. "
                    aspectRatio={1}
                    path={`organizations/${generateId(
                      form.getValues('name')
                    )}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="flex relative w-24 h-24 p-1 rounded-full bg-white mt-[-50px] mx-4">
                <FormControl>
                  <ImageUpload
                    className="w-full h-full rounded-full bg-neutrals-300 text-white m-auto"
                    aspectRatio={1}
                    path={`organizations/${generateId(
                      form.getValues('name')
                    )}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="">
                Organization name
              </FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Bio</FormLabel>
              <FormControl>
                <Input placeholder="Bio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row justify-between">
          <Button
            type="button"
            onClick={() => {
              router.back()
            }}
            variant={'outline'}>
            Go back
          </Button>
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />{' '}
                Please wait
              </>
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
