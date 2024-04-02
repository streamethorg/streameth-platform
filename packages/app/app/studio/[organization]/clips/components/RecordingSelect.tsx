'use client'
import React from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { SelectContent } from '@/components/ui/select'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { Session } from 'livepeer/dist/models/components'
const RecordingSelect = ({
  selectedRecording,
  streamRecordings,
}: {
  selectedRecording?: string
  streamRecordings: Session[]
}) => {
  const { handleTermChange, searchParams } = useSearchParams()

  if (!streamRecordings) return <div>No stream sessions found</div>

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold">Recording</p>
      <Select
        value={selectedRecording}
        onValueChange={(value) => {
          const session = streamRecordings.find((s) => s.id === value)
          session &&
            handleTermChange([
              { key: 'selectedRecording', value: session.id ?? '' },
            ])
        }}>
        <SelectTrigger className="bg-white">
          <SelectValue
            defaultValue={selectedRecording}
            placeholder={'Select a session to create clips from'}
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {streamRecordings.map((session) => (
              <SelectItem key={session.id} value={session.id ?? ''}>
                {new Date(session.lastSeen as number).toUTCString()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default RecordingSelect
