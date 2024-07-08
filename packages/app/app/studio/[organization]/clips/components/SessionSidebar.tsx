'use client'
import React from 'react'
import ClipsSessionList from './ClipSessionList'
import { IExtendedSession } from '@/lib/types'
import Combobox from '@/components/ui/combo-box'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { CardTitle } from '@/components/ui/card'
import { IExtendedEvent } from '@/lib/types'
import { Session, Stream } from 'livepeer/dist/models/components'

const SessionSidebar = ({
  event,
  sessions,
}: {
  event?: IExtendedEvent
  sessions: IExtendedSession[]
  currentRecording?: string
  recordings: {
    parentStream: Stream | undefined
    recordings: Session[]
  }
}) => {
  const [sessionId, setSessionId] = React.useState('')
  const uniqueDates = sessions.filter(
    (session, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          new Date(t.start).getDate() ===
          new Date(session.start).getDate()
      )
  )
  const [dayFilter, setDayFilter] = React.useState(
    uniqueDates[0].start || ''
  )

  return (
    <div className="h-full w-[400px] border-l bg-background bg-white">
      <CardTitle className="w-full border-b bg-white p-2 text-lg">
        <div className="flex flex-col space-y-2">
          <Select onValueChange={(value) => setDayFilter(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue
                defaultValue={uniqueDates[0].start || ''}
                placeholder={
                  new Date(uniqueDates[0].start).toDateString() ||
                  'select a day'
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {uniqueDates.map((session) => (
                  <SelectItem
                    key={session._id}
                    value={session.start.toString()}>
                    {new Date(session.start).toDateString()}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Combobox
            value={
              sessions.find((s) => s._id === sessionId)?.name || ''
            }
            setValue={(value) => setSessionId(value)}
            placeholder="Select a session"
            items={[
              ...sessions
                .filter(
                  (session) =>
                    new Date(session.start).getDate() ===
                    new Date(Number(dayFilter)).getDate()
                )
                .map((session) => ({
                  label:
                    session.assetId !== ''
                      ? session.name + ' ✅'
                      : session.name,
                  value: session._id,
                }))
                .reverse(),
            ]}
          />
        </div>
      </CardTitle>
      <div className="h-[calc(100%-100px)] w-full overflow-y-scroll">
        <ClipsSessionList
          event={event}
          sessions={sessions
            .filter((session) =>
              dayFilter !== ''
                ? new Date(session.start).getDate() ===
                  new Date(Number(dayFilter)).getDate()
                : true
            )
            .filter((session) =>
              sessionId ? session._id === sessionId : true
            )
            .reverse()}
        />
      </div>
    </div>
  )
}

export default SessionSidebar
