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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { StageSchema } from '@/lib/schema';
import { toast } from 'sonner';
import { createStageAction } from '@/lib/actions/stages';
import { Loader2 } from 'lucide-react';
import { IExtendedEvent } from '@/lib/types';

export default function CreateStageForm({ event }: { event: IExtendedEvent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof StageSchema>>({
    resolver: zodResolver(StageSchema),
    defaultValues: {
      name: '',
      eventId: event?._id,
      organizationId: event?.organizationId as string,
      streamSettings: {
        streamId: '',
      },
    },
  });

  function onSubmit(values: z.infer<typeof StageSchema>) {
    setIsLoading(true);
    createStageAction({
      stage: values,
    })
      .then(() => {
        setIsOpen(false);
        toast.success('Stage created');
      })
      .catch(() => {
        toast.error('Error creating stage');
      })
      .finally(() => {
        setIsLoading(false);
        window.history.pushState(null, '', `?eventId=${event.slug}`);
      });
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Button variant={'secondary'} onClick={() => setIsOpen(true)}>
        Create
      </Button>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Create stage</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Stage name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel className="">Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="streamSettings.streamId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel className="">Stream ID</FormLabel>
                  <FormControl>
                    <Input placeholder="streamId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit">Create stage</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
