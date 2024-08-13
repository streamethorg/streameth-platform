import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import ImageUpload from '../form/imageUpload';

const SupportForm = ({
  form,
  onSubmit,
  isLoading,
  handleClose,
}: {
  form: UseFormReturn<{
    message: string;
    telegram?: string;
    email?: string;
    image?: string;
  }>;
  isLoading: boolean;
  onSubmit: (values: { message: string }) => void;
  handleClose: () => void;
}) => {
  return (
    <div>
      <Form {...form}>
        <form
          onError={(errors) => {
            alert(errors);
          }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
              <FormItem className="mt-4 flex rounded-xl border border-dashed">
                <FormControl>
                  <ImageUpload
                    placeholder="Click to upload image here. (Optional) "
                    className="m-auto min-h-[200px] w-full bg-neutrals-300 py-4 text-black"
                    aspectRatio={1}
                    path={`support`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between gap-10">
            <Button
              className="w-full"
              onClick={handleClose}
              type="button"
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              type="submit"
              disabled={getFormSubmitStatus(form)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </Form>{' '}
    </div>
  );
};

export default SupportForm;
