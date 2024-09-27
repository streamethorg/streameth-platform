'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { updateMultipleMarkersAction } from '@/lib/actions/marker';
import { useClipContext } from '../ClipContext';
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
    <div className="flex items-center space-x-2 ml-auto">
      <Input
        type="number"
        value={secondsToAdd}
        onChange={(e) => setSecondsToAdd(Number(e.target.value))}
        className="w-20"
        placeholder="Secs"
      />
      <Button
        disabled={isPushingMarkers}
        onClick={handleAddSeconds}
        variant="outline"
      >
        {isPushingMarkers ? 'Pushing...' : 'Push Markers'}
      </Button>
    </div>
  );
};

export default PushMarkersButton;
