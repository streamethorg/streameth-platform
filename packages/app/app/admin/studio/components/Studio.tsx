'use client'

import { useStreamSessions } from '@livepeer/react'
import { Editor } from './Editor'
import { useCallback, useEffect, useState } from 'react'
import { FilterValidStages } from '../utils/client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

interface Props {
  events: any[]
}

interface StreamParams {
  playbackId: string
  sessionId?: string
}

export default function Studio(props: Props) {
  const [event, setEvent] = useState<any>(props.events[0])
  const [stage, setStage] = useState<any>()
  const [stream, setStream] = useState<StreamParams>({
    playbackId: '',
  })
  const [session, setSessions] = useState<any[]>([])
  const { data: streamSessions } = useStreamSessions(
    stage?.streamSettings?.streamId ?? ''
  )

  async function selectEvent(eventId: string) {
    const event = props.events.find((i: any) => i.id === eventId)

    setEvent(event)
    setStage(event.stages[0])
    setStream({ playbackId: '' })

    const sessions = await fetchSchedule(
      event.organizationId,
      event.id,
      event.stages[0].id
    )
    setSessions(sessions)
  }

  async function selectStage(stageId: string) {
    const stage = event.stages.find((i: any) => i.id === stageId)

    if (stage) {
      setStage(stage)
      setStream({ playbackId: '' })

      const sessions = await fetchSchedule(
        event.organizationId,
        event.id,
        stage.id
      )
      setSessions(sessions)
    }
  }

  const selectStreamCallback = useCallback(selectStream, [
    event.id,
    event.organizationId,
    stage,
    streamSessions,
  ])

  async function selectStream(streamId: string) {
    const stream: any = streamSessions?.find(
      (i: any) => i.id === streamId
    )

    if (stream) {
      setStream({
        playbackId: stream.playbackId,
        sessionId: stream.id,
      })

      let sessions = await fetchSchedule(
        event.organizationId,
        event.id,
        stage.id
      )
      sessions = sessions.filter(
        (i: any) =>
          dayjs(i.start).format('YYYYMMDD') ===
          dayjs(stream.createdAt).format('YYYYMMDD')
      )
      setSessions(sessions)
    }
  }

  async function fetchSchedule(
    organizationId: string,
    eventId: string,
    stageId: string
  ) {
    console.log('fetching schedule', organizationId, eventId, stageId)
    const res = await fetch(
      `/api/organizations/${organizationId}/events/${eventId}/sessions`
    )
    const data = await res.json()

    const filtered = data.filter((i: any) => i.stageId === stageId)
    return filtered
  }

  useEffect(() => {
    const streams = filterStreamSession(streamSessions ?? [])
    const stream = streams[0]
    selectStreamCallback(stream?.id ?? '')
  }, [streamSessions, selectStreamCallback])

  function filterStreamSession(streamSessions: any[]) {
    // Only show streams that have been recorded and are longer than 10 mins
    // 5 day limit is how long 'clippable' streams are kept on Livepeer
    return streamSessions?.filter((i) => {
      return (
        i.record &&
        dayjs(i.createdAt).isAfter(dayjs().subtract(5, 'days')) &&
        i.sourceSegmentsDuration > 600
      )
    })
  }

  if (!event) return <>No events found.</>

  return (
    <div className="p-8 container mx-auto overflow-auto">
      <div className="flex gap-4 text-sm">
        <select
          onChange={(e) => selectEvent(e.target.value)}
          className="p-2 border w-full bg-primary">
          {props.events.map((event, index) => (
            <option
              key={index}
              className="cursor-pointer py-1"
              value={event.id}
              defaultValue={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => selectStage(e.target.value)}
          className="p-2 border w-full bg-primary">
          {event.stages
            .filter((i: any) => i.eventId === event.id)
            .map((event: any, index: number) => (
              <option
                key={index}
                className="cursor-pointer py-1"
                value={event.id}>
                {event.name}
              </option>
            ))}
        </select>

        <select
          onChange={(e) => selectStream(e.currentTarget.value)}
          className="p-2 border w-full bg-primary"
          disabled={!streamSessions || streamSessions.length === 0}>
          {filterStreamSession(streamSessions ?? []).map(
            (stream: any) => (
              <option
                key={stream.id}
                className="cursor-pointer py-1"
                value={stream.id}>
                {dayjs(stream.createdAt).format('MMM DD, HH:mm')} -{' '}
                {dayjs
                  .duration(
                    stream.sourceSegmentsDuration ?? 0,
                    'second'
                  )
                  .format('H')}{' '}
                hours{' '}
                {dayjs
                  .duration(
                    stream.sourceSegmentsDuration ?? 0,
                    'second'
                  )
                  .format('mm')}{' '}
                mins
              </option>
            )
          )}
        </select>
      </div>

      {stream.playbackId && (
        <Editor
          organizationId={event.organizationId}
          eventId={event.id}
          playbackId={stream.playbackId}
          sessionId={stream.sessionId}
          sessions={session}
        />
      )}
    </div>
  )
}
