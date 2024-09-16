'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { injectUrlSchema, ScheduleImportSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createSessionAction } from '@/lib/actions/sessions';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { getHlsUrlAction } from '@/lib/actions/stages';

const InjectUrlInput = ({ organizationId }: { organizationId: string }) => {
  const { handleTermChange } = useSearchParams();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof injectUrlSchema>>({
    resolver: zodResolver(injectUrlSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof injectUrlSchema>) => {
    setLoading(true);
    try {
      let response = await getHlsUrlAction({ url: values.url });
      if (response?.url) {
        handleTermChange([
          { key: 'selectedRecording', value: response.url },
          { key: 'type', value: response.type },
        ]);
      } else {
        toast.error('Error getting HLS URL');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Error getting HLS URL');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-bold">Input url?</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Input name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Input name"
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  {/* <FormLabel className="">input url</FormLabel> */}
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Input url"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="primary" type="submit" loading={loading}>
              Go
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InjectUrlInput;
