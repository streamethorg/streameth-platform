'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { injectUrlSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { importVideoFromUrlAction } from '@/lib/actions/sessions';
import { Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const InjectUrlInput = ({}) => {
  const [loading, setLoading] = useState(false);
  const { organizationId } = useOrganizationContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof injectUrlSchema>>({
    resolver: zodResolver(injectUrlSchema),
    defaultValues: {
      name: 'defautlt',
      url: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof injectUrlSchema>) => {
    setLoading(true);
    try {
      await importVideoFromUrlAction({
        name: values.name,
        url: values.url,
        organizationId,
      }).then(() => {
        toast.success('Video is importing');
        router.push(`/studio/${organizationId}/library`);
      });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* <FormField
          control={form.control}
          name="name"
        //   render={({ field }) => (
        //     <FormItem>
        //       <FormLabel required className="font-semibold">
        //         Name
        //       </FormLabel>
        //       <FormControl>
        //         <Input
        //           {...field}
        //           placeholder="Input name"
        //           className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        //         />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="font-semibold">
                URL
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://www.youtube.com/watch?v=Up3pKJKvsAE"
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          variant="primary"
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default InjectUrlInput;
