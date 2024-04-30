import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Textarea } from '../../ui/textarea'
import { Button } from '../../ui/button'
import { Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { getFormSubmitStatus } from '@/lib/utils/utils'

const SupportForm = ({
  form,
  onSubmit,
  isLoading,
  handleClose,
}: {
  form: UseFormReturn<{
    message: string
    telegram?: string
    email?: string
  }>
  isLoading: boolean
  onSubmit: (values: { message: string }) => void
  handleClose: () => void
}) => {
  return (
    <div>
      <h2 className="pb-2 pt-3 font-bold">Send a support ticket</h2>
      <Form {...form}>
        <form
          onError={(errors) => {
            alert(errors)
          }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Telegram Id</FormLabel>
                <FormControl>
                  <Input placeholder="Telegram Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your issue here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-10 flex-row justify-between">
            <Button
              className="w-full"
              onClick={handleClose}
              type="button"
              variant={'outline'}>
              Cancel
            </Button>
            <Button
              className="w-full"
              type="submit"
              disabled={getFormSubmitStatus(form)}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                  Please wait
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </Form>{' '}
    </div>
  )
}

export default SupportForm
