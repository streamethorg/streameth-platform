import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedSession } from '@/lib/types';
import React from 'react';
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const PastRecordingSelect = ({
  pastRecordings,
}: {
  pastRecordings?: IExtendedSession[];
}) => {
  const { handleTermChange, searchParams } = useSearchParams();

  if (!pastRecordings) return <div>No stream sessions found</div>;

  return (
    <div className="w-full space-y-2">
      <p className="font-bold">Choose Recording</p>
      <Select
        onValueChange={(value) => {
          const session = pastRecordings.find((s) => s._id === value);
          session &&
            handleTermChange([
              { key: 'sessionId', value: session._id ?? '' },
              { key: 'videoType', value: 'recording' },
            ]);
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue
            placeholder={'Select a recording to create clips from'}
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {pastRecordings.map((pastRecording) => (
              <SelectItem
                key={pastRecording._id}
                value={pastRecording._id ?? ''}
              >
                {pastRecording.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PastRecordingSelect;
