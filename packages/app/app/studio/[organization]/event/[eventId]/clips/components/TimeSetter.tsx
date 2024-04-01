'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useClipContext } from './ClipContext'
import { Badge } from '@/components/ui/badge'

type TimeSetterProps = {
  label: string
  type: 'start' | 'end'
}

const TimeSetter: React.FC<TimeSetterProps> = ({ label, type }) => {
  const {
    playbackStatus,
    setStartTime,
    setEndTime,
    startTime,
    endTime,
  } = useClipContext()

  const handleSetTime = () => {
    if (playbackStatus) {
      const timeSetting = {
        unix: Date.now() - playbackStatus.offset,
        displayTime: playbackStatus.progress.toFixed(0).toString(),
      }

      if (type === 'start') {
        setStartTime(timeSetting)
      } else {
        setEndTime(timeSetting)
      }
    }
  }

  return (
    <div className="flex-grow">
      <Label>{label}</Label>
      <div className="flex flex-row border rounded relative h-full">
        <Input
          className="border-none"
          value={
            type === 'start'
              ? startTime?.displayTime
              : endTime?.displayTime
          }
        />
        <Badge
          className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full text-xs bg-accent text-accent-foreground"
          onClick={handleSetTime}>
          Set {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </div>
    </div>
  )
}

export default TimeSetter
