'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createStageAction } from '@/lib/actions/stages'
import { StageSchema } from '@/lib/schema'
import { IExtendedOrganization } from '@/lib/types'
import { getFormSubmitStatus } from '@/lib/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const CreateLivestreamModal = ({
  organization,
}: {
  organization: IExtendedOrganization
}) => {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: '',
      organizationId: organization?._id,
    },
  })

  function onSubmit(values: z.infer<typeof StageSchema>) {
    setIsLoading(true)
    let streamId: string | undefined
    createStageAction({
      stage: values,
    })
      .then((response) => {
        toast.success('Stream created')
        streamId = response?._id as string
      })
      .catch(() => {
        toast.error('Error creating stream')
      })
      .finally(() => {
        setIsLoading(false)
        router.push(
          `/studio/${organization?.slug}/livestreams/${streamId}`
        )
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Create Livestream</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a new livestream</DialogTitle>
          <DialogDescription>
            Newly created streams are assigned a special key and RTMP
            ingest URL to stream into.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="">
                    Stream name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. My first livestream"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                loading={isLoading}
                variant="primary"
                disabled={getFormSubmitStatus(form) || isLoading}
                type="submit">
                Create livestream
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLivestreamModal
