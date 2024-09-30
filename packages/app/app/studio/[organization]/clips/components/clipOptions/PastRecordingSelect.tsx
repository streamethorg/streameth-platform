import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedSession, IExtendedStage } from '@/lib/types';
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
  customUrlStages,
}: {
  customUrlStages: IExtendedStage[];
  pastRecordings?: IExtendedSession[];
}) => {
  const { handleTermChange } = useSearchParams();

  const mergedItems = [
    ...(pastRecordings || []),
    ...customUrlStages.map((stage) => ({ ...stage, isStage: true })),
  ];

  if (mergedItems.length === 0) return <div>No recordings or stages found</div>;

  return (
    <div className="w-full space-y-2">
      <p className="font-bold">Choose Recording</p>
      <Select
        onValueChange={(value) => {
          const item = mergedItems.find((i) => i._id === value);
          if (item) {
            if ('isStage' in item) {
              handleTermChange([
                { key: 'stageId', value: item._id ?? '' },
                { key: 'videoType', value: 'customUrl' },
              ]);
            } else {
              handleTermChange([
                { key: 'sessionId', value: item._id ?? '' },
                { key: 'videoType', value: 'recording' },
              ]);
            }
          }
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue
            placeholder={'Select a recording to create clips from'}
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {mergedItems.map((item) => (
              <SelectItem key={item._id} value={item._id ?? ''}>
                {'isStage' in item
                  ? `Stage: ${item.name}`
                  : `Recording: ${item.name}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PastRecordingSelect;
