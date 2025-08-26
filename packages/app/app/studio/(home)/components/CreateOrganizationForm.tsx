'use client';

import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
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
import { useUserContext } from '@/lib/context/UserContext';
import { IExtendedOrganization } from '@/lib/types';

interface CreateOrganizationFormProps {
  disableName?: boolean;
  organization?: IExtendedOrganization;
}

export default function CreateOrganizationForm({
  disableName = false,
  organization,
}: CreateOrganizationFormProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Get the email safely
  const userEmail = user?.email || '';

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || '',
      banner: organization?.banner || '',
      logo: organization?.logo || '',
      email: organization?.email || '',
      description: organization?.description || '',
      address: userEmail,
    },
  });

  // Update form values when user becomes available
  useEffect(() => {
    if (user?.email) {
      form.setValue('address', user.email);
    }
  }, [user, form]);

  function onSubmit(values: z.infer<typeof organizationSchema>) {
    if (!user) {
      return; // No submission if no user
    }

    setIsLoading(true);
    setNameError(null);

    if (organization) {
      updateOrganizationAction({
        organization: {
          _id: organization._id,
          ...values,
        },
      })
        .then(() => {
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
        toast.success('Organization created');
        router.push(`/studio/${response._id}`);
      })
      .catch((error) => {
        if (error) {
          setNameError('Organization name already taken');
        } else {
          toast.error('Error creating organization');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full space-y-4"
        >
          <div className="flex-1 space-y-4">
            <div className="relative">
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <ImageUpload
                        className="w-full h-40 rounded-xl bg-neutrals-300"
                        options={{
                          resize: true,
                          resizeDimensions: { width: 1500, height: 500 },
                          placeholder:
                            'Click to upload image here. Image will be resized to cover 1500x500 pixels. Maximum file size is 2MB.',
                          aspectRatio: 3 / 1,
                          coverImage: true,
                        }}
                        path="organizations"
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
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        options={{
                          placeholder: 'Upload logo',
                          resize: false,
                          isProfileImage: true,
                          aspectRatio: 1,
                        }}
                        path={`organizations`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
                    <Input
                      disabled={disableName}
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {nameError && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {nameError}
                    </p>
                  )}
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
          </div>

          <div className="flex flex-row justify-end">
            <Button type="submit" variant={'primary'}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </>
              ) : organization ? (
                'Update '
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
