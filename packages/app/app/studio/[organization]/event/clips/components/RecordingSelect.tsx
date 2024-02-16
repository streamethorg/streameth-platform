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
  streamRecordings,
}: {
  streamRecordings: Session[]
}) => {
  const { handleTermChange, searchParams } = useSearchParams()
  const selectedSession = searchParams.get('selectedRecording')

  if (!streamRecordings) return <div>No stream sessions found</div>

  return (
    <Select
      onValueChange={(value) => {
        const session = streamRecordings.find((s) => s.id === value)
        session &&
          handleTermChange([
            { key: 'selectedRecording', value: session.id },
          ])
      }}>
      <SelectTrigger>
        <SelectValue
          placeholder={'Select a session to create clips from'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {streamRecordings.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              {new Date(session.lastSeen as number).toUTCString()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default RecordingSelect
