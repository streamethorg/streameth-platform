'use client'

import { useStreamSessions } from '@livepeer/react'
import { Editor } from './Editor'
import { useEffect, useState } from 'react'
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
  const [stage, setStage] = useState<any>(FilterValidStages(props.events[0].stages)[0])
  const [stream, setStream] = useState<StreamParams>({ playbackId: '' })
  const { data: streamSessions } = useStreamSessions(
    stage?.streamSettings?.streamId ?? ''
  )

  function selectEvent(eventId: string) {
    const event = props.events.find((i: any) => i.id === eventId)

    setEvent(event)
    setStage(event.stages[0])
    setStream({ playbackId: '' })
  }

  function selectStage(stageId: string) {
    const stage = event.stages.find((i: any) => i.id === stageId)

    setStage(stage)
    setStream({ playbackId: '' })
  }

  function selectStream(streamId: string) {
    const stream: any = streamSessions?.find((i: any) => i.id === streamId)

    if (stream) {
      setStream({ playbackId: stream.playbackId, sessionId: stream.id })
    }
  }

  useEffect(() => {
    const streams = filterStreamSession(streamSessions ?? [])
    const stream = streams[0]

    if (stream) {
      setStream({ playbackId: stream.playbackId, sessionId: stream.id })
    }
  }, [streamSessions])

  function filterStreamSession(streamSessions: any[]) {
    // Only show streams that have been recorded and are either active or longer than 1 hour
    // 5 day limit is how long 'clippable' streams are kept on Livepeer
    return streamSessions?.filter((i) =>
      i.record && dayjs(i.createdAt).isAfter(dayjs().subtract(5, 'days')) &&
      (i.isActive || i.sourceSegmentsDuration > 3600))
  }

  return (
    <div className="p-8 container mx-auto">
      <div className='flex gap-4 text-sm'>
        <select
          onChange={(e) => selectEvent(e.target.value)}
          className="p-2 border w-full bg-primary">
          {props.events.map((event, index) => (
            <option
              key={index}
              className="cursor-pointer py-1"
              value={event.id}
              selected={event.id === event.id}>
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
          onChange={(e) => selectStream(e.target.value)}
          className="p-2 border w-full bg-primary"
          disabled={!streamSessions || streamSessions.length === 0}>
          {filterStreamSession(streamSessions ?? []).length === 0 && (
            <option selected disabled>No streams found..</option>
          )}

          {filterStreamSession(streamSessions ?? []).map((stream: any) => (
            <option
              key={stream.id}
              className="cursor-pointer py-1"
              value={stream.id}>
              {dayjs(stream.createdAt).format('MMM DD, HH:mm')} -{' '}
              {dayjs.duration(stream.sourceSegmentsDuration ?? 0, 'second').format('H')} hours{' '}
              {dayjs.duration(stream.sourceSegmentsDuration ?? 0, 'second').format('mm')} mins
            </option>
          ))}
        </select>
      </div>

      {stream.playbackId && <Editor playbackId={stream.playbackId} sessionId={stream.sessionId} />}
    </div>
  )
}
