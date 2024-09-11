'use client';
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedStage } from '@/lib/types';
import { Session, Stream } from 'livepeer/dist/models/components';

const SelectSession = ({
  stages,
  currentStageId,
}: {
  stages: { parentStreamName: string; firstRecording: Session | null }[];
  currentStageId?: string;
}) => {
  const { handleTermChange } = useSearchParams();

  const options = stages.map((stage) => ({
    label: stage.parentStreamName,
    value: stage?.firstRecording?.recordingUrl as string,
  }));

  // const currentStage = options.find(
  //   (option) => option.value === currentStageId
  // );
  // const src = `https://link.storjshare.io/raw/juixm77hfsmhyslrxtycnqfmnlfq/catalyst-recordings-com/hls/${playbackId}/${selectedStreamSession}/output.m3u8`;
  const getSrcValue = ({
    playbackId,
    selectedStreamSession,
  }: {
    playbackId?: string;
    selectedStreamSession?: string;
  }) => {
    return `https://link.storjshare.io/raw/juixm77hfsmhyslrxtycnqfmnlfq/catalyst-recordings-com/hls/${playbackId}/${selectedStreamSession}/output.m3u8`;
  };
  return (
    <div className="flex w-full flex-col space-y-2">
      <p className="text-sm font-bold">Livestream</p>
      <Select
        // value={currentStage?.value}
        onValueChange={(value) =>
          handleTermChange([
            {
              key: 'selectedRecording',
              value,
            },
          ])
        }
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select a livestream" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {stages.map((stage, index) => (
            <SelectItem
              key={index}
              value={
                getSrcValue({
                  playbackId: stage?.firstRecording?.playbackId,
                  selectedStreamSession: stage?.firstRecording?.id,
                }) as string
              }
            >
              {stage.parentStreamName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectSession;
