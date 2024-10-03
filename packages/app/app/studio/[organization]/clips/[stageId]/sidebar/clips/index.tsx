'use client';
import React, { useMemo, useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import Clip from './Clip';

const SessionSidebar = ({
  sessions = [],
}: {
  sessions: IExtendedSession[];
}) => {
  const [filteredSessions, setFilteredSessions] =
    useState<IExtendedSession[]>(sessions);
  const [searchTerm, setSearchTerm] = useState('');

  // Find unique dates among sessions
  const uniqueDates = useMemo(() => {
    const dates = Array.from(
      new Set(
        sessions?.map((session) =>
          new Date(session.createdAt as string).toDateString()
        )
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return ['All dates', ...dates];
  }, [sessions]);

  const [selectedDate, setSelectedDate] = useState(uniqueDates[0]);

  useEffect(() => {
    const filtered = sessions.filter((session) => {
      const dateMatches =
        selectedDate === 'All dates' ||
        new Date(session.createdAt as string).toDateString() === selectedDate;
      const searchMatches = session.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return dateMatches && searchMatches;
    });
    setFilteredSessions(filtered);
  }, [sessions, selectedDate, searchTerm]);

  return (
    <div className="h-full w-full">
      <CardTitle className="w-full border-b bg-white p-2 text-lg">
        <div className="flex flex-col space-y-2">
          <Select
            defaultValue={selectedDate}
            onValueChange={(value) => setSelectedDate(value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue
                defaultValue={selectedDate}
                placeholder={
                  new Date(uniqueDates[0]).toDateString() || 'select a day'
                }
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
          <Input
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardTitle>
      <div className="flex-grow overflow-y-auto">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div key={session._id} className="w-full px-4 py-2">
              <Clip session={session} />
            </div>
          ))
        ) : (
          <div className="flex h-full justify-center mt-10 text-gray-500">
            No clip found
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSidebar;
