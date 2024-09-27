'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClipContext } from '../[stageId]/ClipContext';
import { Badge } from '@/components/ui/badge';

type TimeSetterProps = {
  label: string;
  type: 'start' | 'end';
};

const TimeSetter: React.FC<TimeSetterProps> = ({ label, type }) => {
  const { playbackStatus, setStartTime, setEndTime, startTime, endTime } =
    useClipContext();

  const handleSetTime = () => {
    if (playbackStatus) {
      const timeSetting = {
        unix: Date.now() - playbackStatus.offset,
        displayTime: playbackStatus.progress,
      };

      if (type === 'start') {
        setStartTime(timeSetting);
      } else {
        setEndTime(timeSetting);
      }
    }
  };

  return (
    <div className="w-[200px]">
      <Label>{label}</Label>
      <div className="relative flex h-full flex-row rounded-xl border">
        <Input
          className="border-none bg-white"
          value={
            type === 'start' ? startTime?.displayTime : endTime?.displayTime
          }
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
