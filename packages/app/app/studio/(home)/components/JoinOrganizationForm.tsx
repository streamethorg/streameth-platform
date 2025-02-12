'use client';

import { useState } from 'react';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { joinOrganizationAction } from '@/lib/actions/organizations';
import { useUserContext } from '@/lib/context/UserContext';

const JoinOrganizationSchema = z.object({
  invitationCode: z.string().min(1, 'Invitation code is required'),
});

export default function JoinOrganizationForm() {
  const router = useRouter();
  const { user } = useUserContext();
  if (!user) throw new Error('User not found');
  const { email } = user;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof JoinOrganizationSchema>>({
    resolver: zodResolver(JoinOrganizationSchema),
    defaultValues: {
      invitationCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof JoinOrganizationSchema>) => {
    setIsLoading(true);
    try {
      const organization = await joinOrganizationAction({
        invitationCode: values.invitationCode,
        email: email!,
      });
      toast.success('Successfully joined organization');
      router.push(`/studio/${organization._id}`);
    } catch (error) {
      console.error('Error joining organization:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to join organization'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="invitationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Invitation Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your invitation code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row justify-between">
          <Button
            type="button"
            onClick={() => {
              router.push('/studio');
            }}
            variant={'outline'}
          >
            Go back
          </Button>
          <Button type="submit" variant="primary">
            {isLoading ? 'Joining...' : 'Join'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
