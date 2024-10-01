'use client';
import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { CardTitle } from '@/components/ui/card';
import Marker from './Marker';
import { useClipContext } from '../../ClipContext';
import { IExtendedMarker } from '@/lib/types';
import PushMarkersButton from './PushMarkersButton';

const Markers = ({ organizationId }: { organizationId: string }) => {
  const { isLoading, markers, setFilteredMarkers, filteredMarkers } =
    useClipContext();

  // Find unique dates among markers
  const uniqueDates = useMemo(() => {
    const dates = Array.from(
      new Set(markers.map((marker) => new Date(marker.date).toDateString()))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return ['All dates', ...dates];
  }, [markers]);

  const [selectedDate, setSelectedDate] = useState(uniqueDates[0]);

  // Update filtered markers when date is changed
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setFilteredMarkers(
      value === 'All dates'
        ? markers
        : markers.filter(
            (marker) => new Date(marker.date).toDateString() === value
          )
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col border-l bg-background bg-white">
        <div className="h-[calc(100%-50px)] space-y-4 overflow-y-clip">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-4">
              <div className="aspect-video w-full rounded bg-gray-200 p-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full border-l flex flex-col">
      <CardTitle className="w-full border-b bg-white p-2 text-lg flex-shrink-0">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-semibold">Filter by Date</p>
          <Select defaultValue={selectedDate} onValueChange={handleDateChange}>
            <SelectTrigger className="bg-white">
              <SelectValue
                defaultValue={selectedDate}
                placeholder="Select date"
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardTitle>
      {filteredMarkers.length > 0 && (
        <PushMarkersButton organizationId={organizationId} />
      )}
      <div className="flex-grow overflow-y-auto">
        {filteredMarkers.length > 0 ? (
          filteredMarkers.map((marker: IExtendedMarker) => (
            <div key={marker._id} className="w-full px-4 py-2">
              <Marker marker={marker} organizationId={organizationId} />
            </div>
          ))
        ) : (
          <div className="flex h-full mt-10 justify-center text-gray-500">
            No marker found
          </div>
        )}
      </div>
    </div>
  );
};

export default Markers;
