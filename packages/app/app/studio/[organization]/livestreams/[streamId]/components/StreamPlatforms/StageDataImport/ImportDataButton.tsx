'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
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
import { sessionImportAction } from '@/lib/actions/sessions';
import React, { useState } from 'react';
import { toast } from 'sonner';
import StageImportPreviewDialog from './StageImportPreviewDialog';
import { ISession } from 'streameth-new-server/src/interfaces/session.interface';

const ImportDataButton = ({ organizationId }: { organizationId: string }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('pretalx');
  const [url, setUrl] = useState('');
  const [previewData, setPreviewData] = useState<ISession[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleImportSession = async () => {
    setIsImporting(true);
    await sessionImportAction({
      url,
      type: 'pretalx',
      organizationId,
    })
      .then((response) => {
        if (response) {
          console.log('previewData', response);
          setPreviewData(response?.metadata?.sessions);
          toast.success('Session imported successfully');
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
        <Button onClick={() => setOpen(true)} variant="primary">
          Import Data
        </Button>
        <DialogContent>
          <DialogTitle>Import Data</DialogTitle>
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
              disabled={!url}
              loading={isImporting}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StageImportPreviewDialog
        open={isPreviewOpen}
        previewData={previewData}
        onClose={setIsPreviewOpen}
      />
    </>
  );
};

export default ImportDataButton;
