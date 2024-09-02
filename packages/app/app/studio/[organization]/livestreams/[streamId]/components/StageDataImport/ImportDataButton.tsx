'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stageSessionImportAction } from '@/lib/actions/sessions';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ImportPreviewDialog from './ImportPreviewDialog';
import { IScheduleImportMetadata } from 'streameth-new-server/src/interfaces/schedule-importer.interface';
import { IExtendedStage } from '@/lib/types';
import { ScheduleImportSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ImportDataButton = ({
  organizationId,
  stageId,
  stage,
}: {
  organizationId: string;
  stageId: string;
  stage?: IExtendedStage;
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState<IScheduleImportMetadata>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState('');
  const form = useForm<z.infer<typeof ScheduleImportSchema>>({
    resolver: zodResolver(ScheduleImportSchema),
    defaultValues: {
      type: '',
      url: '',
      organizationId: organizationId,
      stageId: stageId,
    },
  });
  const { watch } = form;
  const type = watch('type');

  const handleImportSession = async (
    values: z.infer<typeof ScheduleImportSchema>
  ) => {
    setIsImporting(true);
    await stageSessionImportAction({
      ...values,
    })
      .then((response) => {
        if (response) {
          setPreviewData(response?.metadata);
          setScheduleId(response?._id);
          toast.success('Preview generated successfully');
          setIsPreviewOpen(true);
          setOpen(false);
        } else {
          toast.error('Error importing data');
        }
      })
      .catch(() => {
        toast.error('Error importing data');
      })
      .finally(() => {
        setIsImporting(false);
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">Import Data</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Import Stage Data</DialogTitle>
          <DialogDescription>
            Import a single room. Please ensure the stage name matches the room
            name exactly.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleImportSession)}
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
                <Button onClick={() => setOpen(false)} variant={'outline'}>
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

      <ImportPreviewDialog
        open={isPreviewOpen}
        previewData={previewData}
        setOpen={setIsPreviewOpen}
        scheduleId={scheduleId}
        organizationId={organizationId}
        stage={stage}
      />
    </>
  );
};

export default ImportDataButton;
