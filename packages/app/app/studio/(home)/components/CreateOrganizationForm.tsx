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
      description: '',
      url: '',
      logo: '',
      location: '',
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
              <FormLabel className="">Organization name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={!form.getValues('name')}
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem className=" max-w-[150px]">
              <FormLabel className="">Logo</FormLabel>
              <FormControl>
                <ImageUpload
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
        <div className="flex flex-row justify-between">
          <Button
            onClick={() => {
              router.back()
            }}
            variant={'outline'}>
            Go back
          </Button>
          <Button disabled={getFormSubmitStatus(form)} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
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
