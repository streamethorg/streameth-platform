'use client';
import { markersImportSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { importMarkersAction } from '@/lib/actions/marker';

const ImportMarkers = ({
  organizationId,
  stageId,
}: {
  organizationId: string;
  stageId: string;
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof markersImportSchema>>({
    resolver: zodResolver(markersImportSchema),
    defaultValues: {
      type: '',
      url: '',
      organizationId: organizationId,
      stageId: stageId,
    },
  });

  const { watch } = form;
  const type = watch('type');

  const handleImportMarkers = async (
    values: z.infer<typeof markersImportSchema>
  ) => {
    setIsImporting(true);
    try {
      const response = await importMarkersAction({
        ...values,
      });
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Markers imported successfully');
        setOpen(false);
      }
    } catch (error) {
      toast.error('Error importing data');
    } finally {
      setIsImporting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Markers</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Import Markers</DialogTitle>
        <DialogDescription>
          Import markers from google sheet or pretalx
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleImportMarkers)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Select Data Source</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Ensure the select value is controlled by the form state
                      onValueChange={(value: string) => {
                        field.onChange(value); // Update form value
                      }}
                    >
                      <SelectTrigger className="rounded-lg border bg-white">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pretalx">Pretalx</SelectItem>
                        <SelectItem value="gsheet">Google Sheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Input {type} url</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="https://myscheduleurl.com/schedule/export/schedule.json"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant={'outline'}
              >
                Cancel
              </Button>
              <Button type="submit" variant={'primary'} loading={isImporting}>
                Import
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportMarkers;
