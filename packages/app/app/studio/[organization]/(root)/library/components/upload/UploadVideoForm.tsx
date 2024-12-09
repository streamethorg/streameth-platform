'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sessionSchema } from '@/lib/schema';
import { Loader2, Earth, Lock, ChevronDown } from 'lucide-react';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import { DialogClose } from '@/components/ui/dialog';
import ImageDropzone from '../../[session]/components/ImageDropzone';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const UploadVideoForm = ({
  session,
  onSessionUpdate,
}: {
  session: z.infer<typeof sessionSchema>;
  onSessionUpdate: (updatedSession: z.infer<typeof sessionSchema>) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      assetId: session.assetId,
      coverImage: session.coverImage || '',
      description: session.description || 'No Description',
      published: session.published || false,
    },
  });

  useEffect(() => {
    form.reset({
      name: session.name,
      assetId: session.assetId,
      coverImage: session.coverImage || '',
      description: session.description || 'No Description',
      published: session.published || false,
    });
  }, [session, form]);

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsLoading(true);
    try {
      onSessionUpdate(values);
    } catch (error) {
      console.error('Failed to update session:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center space-x-2">
                <FormLabel required>Video title</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center space-x-2">
                <FormLabel required>Description</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <div className="flex justify-start items-center space-x-2">
                  {field.value ? (
                    <>
                      <Earth size={16} />
                      <p>Public</p>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <p>Private</p>
                    </>
                  )}
                  <Popover>
                    <PopoverTrigger>
                      <ChevronDown size={20} />
                    </PopoverTrigger>
                    <PopoverContent className="flex justify-start items-center space-x-2 transition-colors cursor-pointer hover:bg-gray-200 z-[999999999999999] w-[150px]">
                      {!field.value ? (
                        <div
                          onClick={() => field.onChange(true)}
                          className="flex items-center space-x-2"
                        >
                          <Earth size={16} />
                          <p>Make Public</p>
                        </div>
                      ) : (
                        <div
                          onClick={() => field.onChange(false)}
                          className="flex items-center space-x-2"
                        >
                          <Lock size={16} />
                          <p>Make Private</p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageDropzone path={`sessions`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <DialogClose>
            <span
              className={` ${buttonVariants({ variant: 'secondary' })} 'text-black border-2`}
            >
              Close
            </span>
          </DialogClose>
          <Button
            disabled={getFormSubmitStatus(form) || isLoading}
            variant={'primary'}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <p className="text-white">Edit asset</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UploadVideoForm;
