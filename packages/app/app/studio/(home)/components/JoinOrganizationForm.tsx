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

const JoinOrganizationSchema = z.object({
  invitationCode: z.string().min(1, 'Invitation code is required'),
});

interface JoinOrganizationFormProps {
  userEmail: string;
}

export default function JoinOrganizationForm({ userEmail }: JoinOrganizationFormProps) {
  const router = useRouter();
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
      // TODO: Implement the join organization action
      toast.success('Successfully joined organization');
      router.refresh();
    } catch (error) {
      console.error('Error joining organization:', error);
      toast.error('Failed to join organization');
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
                <Input
                  placeholder="Enter your invitation code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row justify-end">
          <Button type="submit" variant="primary">
            {isLoading ? 'Joining...' : 'Join'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 