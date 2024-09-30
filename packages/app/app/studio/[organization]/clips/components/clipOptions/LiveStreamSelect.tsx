import React from 'react';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { IExtendedStage } from '@/lib/types';
import useSearchParams from '@/lib/hooks/useSearchParams';

const LiveStreamSelect = ({ liveStages }: { liveStages: IExtendedStage[] }) => {
  const { handleTermChange } = useSearchParams();

  return (
    <div>
      <p className="font-bold">Select a Live Stream</p>
      <Select
        onValueChange={(value) =>
          handleTermChange([
            {
              key: 'videoType',
              value: 'livestream',
            },
            {
              key: 'stageId',
              value: value,
            },
          ])
        }
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select a livestream" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {liveStages.map((stage) => (
            <SelectItem key={stage._id} value={stage._id!}>
              {stage.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LiveStreamSelect;
