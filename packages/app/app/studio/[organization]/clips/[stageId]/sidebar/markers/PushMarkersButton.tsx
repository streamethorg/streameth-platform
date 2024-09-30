'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { updateMultipleMarkersAction } from '@/lib/actions/marker';
import { useClipContext } from '../../ClipContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PushMarkersButton = ({ organizationId }: { organizationId: string }) => {
  const { markers, setMarkers, setFilteredMarkers } = useClipContext();
  const [secondsToAdd, setSecondsToAdd] = useState<number>(0);
  const [isPushingMarkers, setIsPushingMarkers] = useState<boolean>(false);

  const addSecondsToMarkers = async (seconds: number) => {
    setIsPushingMarkers(true);
    const updatedMarkers = markers.map(
      ({ createdAt, updatedAt, __v, ...marker }) => ({
        ...marker,
        startClipTime: marker.startClipTime + seconds,
        endClipTime: marker.endClipTime + seconds,
      })
    );

    try {
      await updateMultipleMarkersAction({
        organizationId,
        markers: updatedMarkers,
      });
      setMarkers(updatedMarkers);
      setFilteredMarkers(updatedMarkers);
      setIsPushingMarkers(false);
      toast.success('Markers updated successfully');
    } catch (error) {
      toast.error('Error updating markers');
    }
  };

  const handleAddSeconds = () => {
    addSecondsToMarkers(secondsToAdd);
    setSecondsToAdd(0);
  };

  return (
    <div className="flex flex-col gap-2 m-2 border-b border-gray-200 pb-2">
      <p className="text-sm font-semibold">Push Markers by X seconds</p>
      <div className="flex items-center gap-2">
        <p className="text-sm">Seconds:</p>
        <Input
          type="number"
          step="any"
          value={secondsToAdd}
          onChange={(e) => {
            const value = e.target.value === '' ? '' : Number(e.target.value);
            setSecondsToAdd(value || 0);
          }}
          className="w-20"
          placeholder="Secs"
        />
        <Button
          disabled={isPushingMarkers}
          onClick={handleAddSeconds}
          variant="outline"
        >
          {isPushingMarkers ? 'Pushing...' : 'Push'}
        </Button>
      </div>
    </div>
  );
};

export default PushMarkersButton;
