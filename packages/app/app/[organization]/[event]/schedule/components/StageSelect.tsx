'use client';
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface';
import useSearchParams from '@/lib/hooks/useSearchParams';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IExtendedStage } from '@/lib/types';

const StageSelect = ({ stages }: { stages: IExtendedStage[] }) => {
  const { searchParams, handleTermChange } = useSearchParams();

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm">Stage</span>
      <Select
        defaultValue={searchParams.get('stage') || stages[0]?._id}
        onValueChange={(value: string) =>
          handleTermChange([
            {
              key: 'stage',
              value,
            },
          ])
        }
      >
        <SelectTrigger className="rounded-lg border bg-white">
          <SelectValue placeholder="Stage select" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-white border-opacity-10 bg-white">
          {stages.map((stage) => (
            <SelectItem key={stage._id} value={stage._id as string}>
              {stage.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StageSelect;
