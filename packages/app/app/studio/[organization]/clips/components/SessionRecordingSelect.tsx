'use client';
import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { Session } from 'livepeer/dist/models/components';
import { IExtendedSession } from '@/lib/types';

const SessionRecordingSelect = ({
  sessions,
}: {
  sessions?: IExtendedSession[];
}) => {
  const { handleTermChange, searchParams } = useSearchParams();

  if (!sessions) return <div>No stream sessions found</div>;

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-bold">Recording</p>
      <Select
        // value={selectedRecording}
        onValueChange={(value) => {
          const session = sessions.find((s) => s.videoUrl === value);
          session &&
            handleTermChange([
              { key: 'selectedRecording', value: session.videoUrl ?? '' },
            ]);
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue
            // defaultValue={selectedRecording}
            placeholder={'Select a session to create clips from'}
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {sessions.map((session) => (
              <SelectItem key={session._id} value={session.videoUrl ?? ''}>
                {session.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SessionRecordingSelect;
