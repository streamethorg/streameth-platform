import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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
    console.log(playbackStatus, 'playbackStatus')
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

{
  /* <Label>Clip start</Label>
<Input  type="number" value={startTime?.displayTime} />
<Button
  type="button"
  className="px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:shadow-none"
  onClick={() => {
    const progress = playbackStatus?.progress
    const offset = playbackStatus?.offset
    console.log(progress, offset, progress && offset, 'clikc start')
    if (progress !== undefined && offset !== undefined) {
      const calculatedTime = Date.now() - offset
      setStartTime({
        unix: calculatedTime,
        displayTime: progress.toFixed(0).toString(),
      })
    }
  }}>
  Set Start
</Button> */
}
