'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { organizationSchema } from '@/lib/schema';
import { toast } from 'sonner';
import {
  createOrganizationAction,
  updateOrganizationAction,
} from '@/lib/actions/organizations';
import { Loader2 } from 'lucide-react';
import ImageUpload from '@/components/misc/form/imageUpload';
import { useRouter } from 'next/navigation';
import { IExtendedOrganization } from '@/lib/types';

export default function CreateOrganizationForm({
  organization,
  disableName = false,
}: {
  organization?: IExtendedOrganization;
  disableName?: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || '',
      banner: organization?.banner || '',
      logo: organization?.logo || '',
      email: organization?.email || '',
      description: organization?.description || '',
      // url: organization?.url || '',
    },
  });

  function onSubmit(values: z.infer<typeof organizationSchema>) {
    setIsLoading(true);

    if (organization) {
      updateOrganizationAction({
        organization: {
          _id: organization._id,
          ...values,
        },
      })
        .then(() => {
          setIsOpen(false);
          toast.success('Organization updated');
        })
        .catch(() => {
          toast.error('Error updating organization');
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }

    createOrganizationAction({
      organization: values,
    })
      .then((response) => {
        setIsOpen(false);
        toast.success('Organization created');
        router.push(`/studio/${response.slug}`);
      })
      .catch(() => {
        toast.error('Error creating organization');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <ImageUpload
                    className="bg-neutrals-300 h-40 w-full rounded-xl"
                    placeholder="Click to upload image here. Maximum image file size is 5MB.
                    Best resolution of 1500 x 500px. Aspect ratio of 3:1."
                    aspectRatio={1}
                    path={`organizations`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <>
                <FormItem className="relative z-40 mx-4 mt-[-50px] flex h-24 w-24 rounded-full bg-white p-1">
                  <FormControl>
                    <ImageUpload
                      className="bg-neutrals-300 m-auto h-full w-full rounded-full text-white"
                      aspectRatio={1}
                      path={`organizations`}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
                <FormMessage />
              </>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="">
                Organization name
              </FormLabel>
              <FormControl>
                <Input disabled={disableName} placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="">
                Email
              </FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Company website</FormLabel>
              <FormControl>
                <Input placeholder="Company website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex flex-row justify-between">
          {!organization && (
            <Button
              type="button"
              onClick={() => {
                router.back();
              }}
              variant={'outline'}
            >
              Go back
            </Button>
          )}
          <Button type="submit" className="ml-auto" variant={'primary'}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : organization ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
