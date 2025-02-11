'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClipPageContext } from '@/app/studio/[organization]/(no-side-bar)/clips/[stageId]/ClipPageContext';
import { Badge } from '@/components/ui/badge';
import { useTrimmControlsContext } from '../[stageId]/Timeline/TrimmControlsContext';
import usePlayer from '@/lib/hooks/usePlayer';

type TimeSetterProps = {
  label: string;
  type: 'start' | 'end';
};

const TimeSetter: React.FC<TimeSetterProps> = ({ label, type }) => {
  const { videoRef } = useClipPageContext();

  const { currentTime } = usePlayer(videoRef);
  const { setStartTime, setEndTime, startTime, endTime } =
    useTrimmControlsContext();

  const handleSetTime = () => {
    if (type === 'start') {
      setStartTime(currentTime);
    } else {
      setEndTime(currentTime);
    }
  };

  return (
    <div className="w-[200px]">
      <Label>{label}</Label>
      <div className="relative flex h-full flex-row rounded-xl border">
        <Input
          className="border-none bg-white"
          value={type === 'start' ? startTime : endTime}
        />
        <Badge
          className="absolute right-0 top-1/2 mx-2 -translate-y-1/2 transform rounded-full bg-accent text-xs text-accent-foreground"
          onClick={handleSetTime}
        >
          Set {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </div>
    </div>
  );
};

export default TimeSetter;
