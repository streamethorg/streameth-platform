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
  DialogHeader,
} from '@/components/ui/dialog'
import { sessionSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { createSessionAction } from '@/lib/actions/sessions'
import { Loader2 } from 'lucide-react'
import { useAccount } from 'wagmi'
import { getFormSubmitStatus } from '@/lib/utils/utils'

export default function CreateSession({
  eventId,
  organizationId,
  stageId,
}: {
  eventId: string
  organizationId: string
  stageId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      description: '',
      start: Date.now(),
      end: Date.now(),
      stageId,
    },
  })

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsLoading(true)
    if (!address) {
      toast.error('No wallet address found')
      return
    }
    createSessionAction({
      session: { ...values, eventId, organizationId, speakers: [] },
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
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        Create an clip
      </Button>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Create a new clip</DialogTitle>
        </DialogHeader>
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
                  <FormLabel className="">
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
            <Button
              disabled={getFormSubmitStatus(form)}
              type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                  Please wait
                </>
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
