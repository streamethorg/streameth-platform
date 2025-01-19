'use client';
import React from 'react';
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
import { useClipsSidebar } from './ClipsContext';
import { Skeleton } from '@/components/ui/skeleton';

const SessionSidebar = () => {
  const {
    filteredSessions,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    uniqueDates,
    isLoading,
  } = useClipsSidebar();

  return (
    <div className="h-full w-full flex flex-col">
      <CardTitle className="w-full border-b bg-white p-2 text-lg flex-shrink-0">
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
      <div className="flex-grow overflow-y-auto pb-4">
        {isLoading ? (
          <div className="flex flex-col h-full">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="w-full px-4 py-2">
                <Skeleton className="h-32 w-full " />
              </div>
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div key={session._id} className="w-full px-4 py-2">
              <Clip session={session} />
            </div>
          ))
        ) : (
          <div className="flex h-full justify-center mt-10 text-gray-500">
            No clips created
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSidebar;
