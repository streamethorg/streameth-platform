import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IMarker, useClipContext } from '../ClipContext';
import {
  IExtendedMarkers,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';
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
import { fetchAllSessions } from '@/lib/services/sessionService';
import ImportSchedule from '../../../livestreams/components/ImportSchedule';

interface ImportMarkersProps {
  organizationMarkers?: IExtendedMarkers[];
  organizationId: string;
  stages: IExtendedStage[];
}

const ImportMarkers: React.FC<ImportMarkersProps> = ({
  organizationMarkers,
  organizationId,
  stages,
}) => {
  const { videoRef } = useClipContext();
  const { setMarkers } = useClipContext();
  const [open, setOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [stageSessions, setStageSessions] = useState<IExtendedSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const getStageSessions = async () => {
    const sessions = await fetchAllSessions({ stageId: selectedStageId });
    setStageSessions(sessions?.sessions || []);

    // Extract unique dates from sessions
    const dates = [
      ...new Set(
        sessions?.sessions.map(
          (session) =>
            new Date(session.createdAt as string).toISOString().split('T')[0]
        )
      ),
    ];
    setAvailableDates(['all', ...dates]);
  };

  useEffect(() => {
    if (selectedStageId) {
      getStageSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStageId]);

  const getSessionsCount = () => {
    if (selectedDate === 'all') {
      return stageSessions.length;
    } else {
      return stageSessions.filter(
        (session) =>
          new Date(session.createdAt as string).toISOString().split('T')[0] ===
          selectedDate
      ).length;
    }
  };

  const handleImport = () => {
    let importedMarker: IMarker | undefined;
    if (selectedStageId) {
      // Import from stage
      const selectedStage = stages.find(
        (stage) => stage._id === selectedStageId
      );
      if (selectedStage) {
        const filteredSessions =
          selectedDate === 'all'
            ? stageSessions.reverse()
            : stageSessions
                .filter(
                  (session) =>
                    new Date(session.createdAt as string)
                      .toISOString()
                      .split('T')[0] === selectedDate
                )
                .reverse();

        const videoStartTime = videoRef.current
          ? videoRef.current.currentTime
          : 0;
        const firstSessionStart = new Date(
          filteredSessions[0]?.start
        ).getTime();

        importedMarker = {
          name: selectedStage.name,
          organizationId: organizationId,
          metadata: filteredSessions.map((session) => {
            const sessionStart = new Date(session.start).getTime();
            const sessionEnd = new Date(session.end).getTime();
            return {
              id: session._id,
              title: session.name,
              start: (sessionStart - firstSessionStart) / 1000 + videoStartTime,
              end: (sessionEnd - firstSessionStart) / 1000 + videoStartTime,
              color: '#FFA500',
              description: session.description || '',
            };
          }),
        };
      }
    } else {
      // Import from saved markers
      const marker = organizationMarkers?.find(
        (m) => m._id === selectedMarkerId
      );
      if (marker) {
        importedMarker = {
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
      }
    }

    if (!importedMarker) {
      toast.error('Error importing markers');
      return;
    }

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
            {organizationMarkers && organizationMarkers.length > 0 && (
              <>
                <p className="font-semibold">Import from saved markers:</p>
                <Select
                  onValueChange={(value) => {
                    setSelectedMarkerId(value);
                    setSelectedStageId('');
                  }}
                >
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
            )}

            <p className="font-semibold mt-4">Or import from a stage:</p>
            <Select
              value={selectedStageId}
              onValueChange={(value) => {
                setSelectedStageId(value);
                setSelectedMarkerId(null);
                setSelectedDate('all');
              }}
            >
              <SelectTrigger className="rounded-lg border bg-white">
                <SelectValue placeholder="Choose stage" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
                {stages?.map((stage) => (
                  <SelectItem key={stage._id} value={stage._id!}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {availableDates.length > 2 && (
              <>
                <p className="font-semibold mt-4">Select date:</p>
                <Select
                  value={selectedDate}
                  onValueChange={(value) => setSelectedDate(value)}
                >
                  <SelectTrigger className="rounded-lg border bg-white">
                    <SelectValue placeholder="Choose date" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
                    {availableDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date === 'all' ? 'All Dates' : date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {getSessionsCount() > 0 ? (
              <p className="text-sm text-gray-500">
                {getSessionsCount()} session
                {getSessionsCount() !== 1 ? 's' : ''} found for the selected
                stage
                {selectedDate !== 'all' ? ` on ${selectedDate}` : ''}.
              </p>
            ) : selectedStageId ? (
              <p className="text-sm text-gray-500 italic">
                No sessions found for the selected stage and date.
              </p>
            ) : null}

            <p className="font-semibold">Or import new markers:</p>
            {/* <Button variant={'secondary'}>Upload Markers File</Button> */}
            {/* <ImportSchedule organizationId={organizationId} /> */}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={'primary'}
              onClick={handleImport}
              disabled={!selectedMarkerId && !selectedStageId}
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
