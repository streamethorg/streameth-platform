'use client';
import { markersImportSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { useClipContext } from '../../ClipContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const ImportMarkersForm = ({ organizationId }: { organizationId: string }) => {
  const { stageId, setIsImportingMarkers, fetchAndSetMarkers } =
    useClipContext();
  const [isImporting, setIsImporting] = useState(false);

  const form = useForm<z.infer<typeof markersImportSchema>>({
    resolver: zodResolver(markersImportSchema),
    defaultValues: {
      type: '',
      url: '',
      organizationId,
      stageId,
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
        fetchAndSetMarkers();
      }
    } catch (error) {
      toast.error('Error importing data');
    } finally {
      setIsImporting(false);
      setIsImportingMarkers(false);
    }
  };
  return (
    <Card className="border-none rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Import Markers</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleImportMarkers)}
          className="space-y-2"
        >
          <CardContent className="border space-y-4 pt-2">
            <CardDescription>
              Import markers from Google Sheets or Pretalx. Ensure that the
              source stage name matches the stage you are importing to.
            </CardDescription>
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
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                className="w-1/4"
                onClick={() => setIsImportingMarkers(false)}
                variant={'outline'}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-3/4"
                variant={'primary'}
                loading={isImporting}
              >
                {isImporting ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ImportMarkersForm;
