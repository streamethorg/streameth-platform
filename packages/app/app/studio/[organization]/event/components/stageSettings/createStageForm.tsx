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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from '@/components/ui/dialog'
import { StageSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { useCreateStream } from '@livepeer/react'
import { useEffect } from 'react'
import { useCreateStage } from '@/lib/hooks/server/stage'

export default function CreateStageForm({
  eventId,
}: {
  eventId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: createStream } = useCreateStream({
    name: eventId,
    record: true,
  })

  const {
    createStage,
    isLoading: isStageLoading,
    isSuccess: isStageSuccess,
    isError: isStageError,
  } = useCreateStage()

  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: '',
      eventId: eventId,
      streamSettings: {
        streamId: '992ac347-7cb5-4f51-87fb-1608e9b034b2',
      },
    },
  })

  function onSubmit(values: z.infer<typeof StageSchema>) {
    // temp
    createStage({
      stage: values,
    })
    return
    createStream?.()?.then((res) => {
      if (res) {
        values.streamSettings.streamId = res.id
        createStage({
          stage: values,
        })
      } else {
        toast.error('Error creating stage, contact support')
      }
    })
  }

  useEffect(() => {
    if (isStageSuccess) {
      toast.success('Stage created')
      setIsOpen(false)
    }
    if (isStageError) {
      toast.error('Error creating stage, contact support')
    }
  }, [isStageSuccess, isStageError])

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Button variant={'secondary'} onClick={() => setIsOpen(true)}>
        Create
      </Button>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Create stage</DialogTitle>
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
                  <FormLabel className="">Stage name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem className="hidden">
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
              name="streamSettings.streamId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel className="">Stream ID</FormLabel>
                  <FormControl>
                    <Input placeholder="streamId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create stage</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
