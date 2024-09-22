'use client';
import React, { useEffect } from 'react';
import { IExtendedSession } from '@/lib/types';
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
import { Input } from '@/components/ui/input';
import Clip from './Clip';
import { useClipContext } from '../../ClipContext';

const SessionSidebar = ({ organizationId }: { organizationId: string }) => {
  const { stageId } = useClipContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessions, setSessions] = React.useState<IExtendedSession[]>([]);
  const [filteredSessions, setFilteredSessions] = React.useState<
    IExtendedSession[]
  >([]);
  const uniqueDates = sessions.filter(
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
      fetchAllSessions({
        organizationSlug: organizationId,
        limit: 20,
        page: 1,
        // stageId: stageId,
        onlyVideos: true,
        type: 'video',
      }).then((res) => {
        setSessions(res.sessions);
        setFilteredSessions(res.sessions);
        setIsLoading(false);
      });
    }
  }, [stageId]);

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
          <Input
            placeholder="Search"
            onChange={(e) => {
              setFilteredSessions(
                sessions.filter((session) =>
                  session.name.includes(e.target.value)
                )
              );
            }}
          />
        </div>
      </CardTitle>
      <div className="h-[calc(100%-130px)] w-full overflow-y-scroll">
        {filteredSessions.map((session) => (
          <div key={session._id} className="w-full px-4 py-2">
            <Clip session={session} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionSidebar;
