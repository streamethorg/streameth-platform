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

const SupportForm = ({
  form,
  onSubmit,
  isLoading,
  handleClose,
}: {
  form: UseFormReturn<{
    message: string
  }>
  isLoading: boolean
  onSubmit: (values: { message: string }) => void
  handleClose: () => void
}) => {
  return (
    <div className="w-[250px]">
      <h2 className="pb-4 font-bold">Write to us</h2>
      <Form {...form}>
        <form
          onError={(errors) => {
            alert(errors)
          }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the bug here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between">
            <Button
              onClick={handleClose}
              type="button"
              variant={'outline'}>
              Cancel
            </Button>
            <Button type="submit">
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
