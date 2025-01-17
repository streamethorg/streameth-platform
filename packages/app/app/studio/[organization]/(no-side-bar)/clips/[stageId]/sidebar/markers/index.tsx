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
import { IExtendedMarker } from '@/lib/types';
import { useMarkersContext } from './markersContext';
import { extractHighlightsAction } from '@/lib/actions/sessions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClipContext } from '../../ClipContext';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const Markers = ({ sessionId }: { sessionId: string }) => {
  const {
    isLoadingMarkers,
    markers,
    setFilteredMarkers,
    filteredMarkers,
    organizationId,
    fetchAndSetMarkers,
  } = useMarkersContext();

  const { stageId } = useClipContext();

  // Find unique dates among markers
  const uniqueDates = useMemo(() => {
    const dates = Array.from(
      new Set(
        markers.map((marker) => {
          const date = new Date(marker.date);
          return date.toDateString();
        })
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return ['All dates', ...dates];
  }, [markers]);

  const [selectedDate, setSelectedDate] = useState(uniqueDates[0]);
  const [prompt, setPrompt] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

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

  const handleExtractHighlights = async () => {
    setIsExtracting(true);
    extractHighlightsAction({
      sessionId: sessionId,
      stageId: stageId,
      prompt: prompt,
    })
      .then((res) => {
        console.log(res);
        fetchAndSetMarkers();
        setIsExtracting(false);
      })
      .catch((err) => {
        toast.error('Failed to extract highlights');
        setIsExtracting(false);
      });
  };

  if (isLoadingMarkers) {
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
      <CardTitle className="w-full border-b bg-white p-2 space-y-2 text-lg flex-shrink-0">
        {/* <div className="flex flex-col space-y-2">
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
        </div> */}
        <Textarea
          placeholder="Prompt for highlights"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {isExtracting ? (
          <Button disabled>Extracting...</Button>
        ) : (
          <Button
            className="w-full"
            variant="primary"
            onClick={() => {
              handleExtractHighlights();
            }}
          >
            Extract Highlights
          </Button>
        )}
      </CardTitle>
      <div className="flex-grow overflow-y-auto pb-4">
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
