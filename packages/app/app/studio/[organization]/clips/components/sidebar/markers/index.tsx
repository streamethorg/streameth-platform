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
import useSearchParams from '@/lib/hooks/useSearchParams';
import { fetchAllSessions } from '@/lib/services/sessionService';
import Marker from './Marker';
import { useClipContext } from '../../ClipContext';

// temp
export interface IMarker {
  _id: string;
  name: string;
  description: string;
  organizationId: string;
  stageId: string;
  start: number;
  end: number;
  date: string;
  color: string;
  speakers?: any[];
  slug: string;
}

const Markers = ({ organizationId }: { organizationId: string }) => {
  const { searchParams } = useSearchParams();
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
  const stage = searchParams.get('stage');

  useEffect(() => {
    if (stage) {
      setIsLoading(true);
      fetchAllSessions({
        organizationSlug: organizationId,
        limit: 20,
        page: 1,
        //stageId: stage,
        onlyVideos: true,
        type: 'video',
      }).then((res) => {
        setMarkers(res.sessions);
        setIsLoading(false);
      });
    }
  }, [stage]);

  const updateMarker = (marker: IMarker) => {
    // call api to update marker

    const updatedMarkers = markers.map((m) => {
      if (m._id === marker._id) {
        return marker;
      }
      return m;
    });
    setMarkers(updatedMarkers);
  };

  const deleteMarker = (markerId: string) => {
    // call api to delete marker
    const updatedMarkers = markers.filter((m) => m._id !== markerId);
    setMarkers(updatedMarkers);
  };

  const addMarker = (marker: IMarker) => {
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
          {/* <Input
            placeholder="Search"
            onChange={(e) => {
              setFilteredSessions(
                sessions.filter((session) =>
                  session.name.includes(e.target.value)
                )
              );
            }}
          /> */}
        </div>
      </CardTitle>
      <div className="h-[calc(100%-130px)] w-full overflow-y-scroll">
        {markers.map((session) => (
          <div key={session._id} className="w-full px-4 py-2">
            <Marker
              marker={session as IMarker}
              updateMarker={updateMarker}
              deleteMarker={deleteMarker}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Markers;
