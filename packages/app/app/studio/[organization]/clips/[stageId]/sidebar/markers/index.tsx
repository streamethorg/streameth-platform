'use client';
import React, { useEffect } from 'react';
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
import { fetchMarkers } from '@/lib/services/markerSevice';
// temp

/* Whats missing:
    - Properly extract all posible dates for markers
    - We are missing an empty state
    - Right now i am fetching all sessions, this was done as a mock. 
    - We just work with the marker collection.
    - I created a mock type, lets use the right marker type.
          
  */

const Markers = ({ organizationId }: { organizationId: string }) => {
  const { stageId } = useClipContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const { markers, setMarkers } = useClipContext();

  const uniqueDates = markers.filter(
    (session, index, self) =>
      index ===
      self.findIndex(
        (t) => new Date(t.start).getDate() === new Date(session.start).getDate()
      )
  );
  const [dayFilter, setDayFilter] = React.useState(uniqueDates[0]?.start || '');

  useEffect(() => {
    if (stageId) {
      setIsLoading(true);
      fetchMarkers({
        organizationId: organizationId,
        stageId: stageId,
      }).then((markers) => {
        setMarkers(markers);
        setIsLoading(false);
      });
    }
  }, [stageId]);

  const addMarker = (marker: IExtendedMarker) => {
    // call api to add marker
    setMarkers([...markers, marker]);
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
    <div className="h-full w-full border-l">
      <CardTitle className="w-full border-b bg-white p-2 text-lg">
        <div className="flex flex-col space-y-2">
          <Select onValueChange={(value) => setDayFilter(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue
                defaultValue={uniqueDates[0]?.start || ''}
                placeholder={
                  new Date(uniqueDates[0]?.start).toDateString() ||
                  'select a day'
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {uniqueDates.map((session) => (
                  <SelectItem
                    key={session._id}
                    value={session.start.toString()}
                  >
                    {new Date(session.start).toDateString()}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardTitle>
      <div className="h-[calc(100%-130px)] w-full overflow-y-scroll">
        {markers.map((marker) => (
          <div key={marker._id} className="w-full px-4 py-2">
            <Marker marker={marker} organizationId={organizationId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Markers;
