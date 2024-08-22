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
import { Label } from '@/components/ui/label';
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

const ImportDataButton = ({
  organizationId,
  stageId,
}: {
  organizationId: string;
  stageId: string;
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('pretalx');
  const [url, setUrl] = useState('');
  const [previewData, setPreviewData] = useState<IScheduleImportMetadata>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState('');

  const handleImportSession = async () => {
    setIsImporting(true);
    await stageSessionImportAction({
      url,
      type: source,
      organizationId,
      stageId,
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
            name exactly and the URL ends with .json.
          </DialogDescription>

          <Label>Select Data Source</Label>
          <Select
            defaultValue={source}
            onValueChange={(value: string) => setSource(value)}
          >
            <SelectTrigger className="rounded-lg border bg-white">
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pretalx">Pretalx</SelectItem>
            </SelectContent>
          </Select>

          <Label>Input {source} API url</Label>
          <Input
            className="rounded-lg border bg-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://myscheduleurl.com/schedule/export/schedule.json"
          />
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant={'outline'}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleImportSession();
              }}
              variant={'primary'}
              disabled={url.length < 8}
              loading={isImporting}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportPreviewDialog
        open={isPreviewOpen}
        previewData={previewData}
        setOpen={setIsPreviewOpen}
        scheduleId={scheduleId}
      />
    </>
  );
};

export default ImportDataButton;
