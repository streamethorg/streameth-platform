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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { importMarkersAction } from '@/lib/actions/marker';
import { stageSessionImportAction } from '@/lib/actions/sessions';
import { ScheduleImportSchema } from '@/lib/schema';
import { IExtendedMarker, IExtendedStage } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileDown } from 'lucide-react';
import React, { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IScheduleImportMetadata } from 'streameth-new-server/src/interfaces/schedule-importer.interface';
import { z } from 'zod';
import ImportPreviewDialog from './ImportPreviewDialog';

const ImportDataButton = ({
  organizationId,
  stageId,
  stage,
  markers,
}: {
  organizationId: string;
  stageId: string;
  stage?: IExtendedStage;
  markers: IExtendedMarker[];
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const form = useForm<z.infer<typeof ScheduleImportSchema>>({
    resolver: zodResolver(ScheduleImportSchema),
    defaultValues: {
      type: '',
      url: '',
      organizationId,
      stageId,
    },
  });
  const { watch } = form;
  const type = watch('type');

  const handleImportSession = async (
    values: z.infer<typeof ScheduleImportSchema>
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
        // fetchAndSetMarkers();
      }
    } catch (error) {
      toast.error('Error importing data');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'outline'}>
            <LuImport className="w-4 h-4 mr-2" />
            Import Markers
          </Button>
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

      {openPreview && (
        <ViewMarkersDialog
          isFromImport={true}
          open={openPreview}
          setOpenPreview={setOpenPreview}
          markers={markers}
        />
      )}
    </>
  );
};

export default ImportDataButton;
