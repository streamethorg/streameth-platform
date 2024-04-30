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
import ImageUpload from '../form/imageUpload'

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
    image?: string
  }>
  isLoading: boolean
  onSubmit: (values: { message: string }) => void
  handleClose: () => void
}) => {
  return (
    <div>
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
                <FormLabel className="">Telegram ID</FormLabel>
                <FormControl>
                  <Input placeholder="@streameth" {...field} />
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
                    className="h-[120px]"
                    placeholder="Describe your issue here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex p-2   mt-4">
                {/* <FormLabel>Image</FormLabel> */}
                <FormControl>
                  <ImageUpload
                    placeholder="Drag or click to upload image here. "
                    className="w-full h-full bg-neutrals-300 text-black m-auto py-4"
                    aspectRatio={1}
                    path={`support`}
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
