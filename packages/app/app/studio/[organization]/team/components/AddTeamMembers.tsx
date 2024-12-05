'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addOrganizationMemberAction } from '@/lib/actions/organizations';
import { toast } from 'sonner';
import { addOrganizationMemberSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import { Loader2 } from 'lucide-react';

const AddTeamMembers = ({ organizationId }: { organizationId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof addOrganizationMemberSchema>>({
    resolver: zodResolver(addOrganizationMemberSchema),
    defaultValues: {
      memberAddress: '',
    },
  });

  function onSubmit(values: z.infer<typeof addOrganizationMemberSchema>) {
    setIsLoading(true);

    addOrganizationMemberAction({
      memberAddress: values.memberAddress,
      organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Member Added to Organization');
          form.reset();
        } else {
          toast.error('Error adding team member');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="memberAddress"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="relative">
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <div className="absolute left-0 -bottom-6">
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading || getFormSubmitStatus(form)}
            variant="primary"
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
              </>
            ) : (
              <span>Invite</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddTeamMembers;
