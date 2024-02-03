import React from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { useClipContext } from './ClipContext'
import { useStreamSessions } from '@livepeer/react'
import { SelectContent } from '@/components/ui/select'

const SessionSelect = ({ streamId }: { streamId: string }) => {
  const { setSelectedStreamSession } = useClipContext()

  const { data: streamSessions, isLoading } = useStreamSessions({
    streamId,
  })

  if (isLoading) return null
  if (!streamSessions) return <div>No stream sessions found</div>

  return (
    <Select
      onValueChange={(value) => {
        const session = streamSessions.find((s) => s.id === value)
        session && setSelectedStreamSession(session)
      }}>
      <SelectTrigger>
        <SelectValue
          placeholder={'Select a session to create clips from'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {streamSessions.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              {new Date(session.lastSeen as number).toUTCString()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SessionSelect
