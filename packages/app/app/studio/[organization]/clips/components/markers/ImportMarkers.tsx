import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IMarker, useClipContext } from '../ClipContext';
import { IExtendedMarkers } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { toast } from 'sonner';

interface ImportMarkersProps {
  organizationMarkers?: IExtendedMarkers[];
}

const ImportMarkers: React.FC<ImportMarkersProps> = ({
  organizationMarkers,
}) => {
  const { setMarkers } = useClipContext();
  const [open, setOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const handleImport = () => {
    const marker = organizationMarkers?.find((m) => m._id === selectedMarkerId);
    if (!marker) {
      toast.error('Error importing markers');
      return;
    }
    const importedMarker: IMarker = {
      _id: marker._id,
      name: marker.name,
      organizationId: marker.organizationId.toString(),
      metadata: marker.metadata.map((m) => ({
        id: m.id,
        start: m.start,
        end: m.end,
        color: m.color,
        title: m.title,
        description: m.description || '',
      })),
    };
    setMarkers(importedMarker);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'outline'}>Import Markers</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Markers</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {organizationMarkers && organizationMarkers.length > 0 ? (
              <>
                <p className="font-semibold">Select from saved markers:</p>
                <Select onValueChange={(value) => setSelectedMarkerId(value)}>
                  <SelectTrigger className="rounded-lg border bg-white">
                    <SelectValue placeholder="Choose saved markers" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
                    {organizationMarkers.map((marker) => (
                      <SelectItem key={marker._id} value={marker._id}>
                        {marker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <p>No saved markers available.</p>
            )}

            <p className="font-semibold">Or import new markers:</p>
            <Button variant={'secondary'}>Upload Markers File</Button>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={'primary'}
              onClick={handleImport}
              disabled={!selectedMarkerId}
            >
              Import Selected Markers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportMarkers;
