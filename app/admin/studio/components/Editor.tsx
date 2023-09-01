'use client'

import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { ISession } from '@/server/model/session'
import { apiUrl } from '@/server/utils'
import { StreamSession, useStreamSessions } from '@livepeer/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { SessionList } from './SessionList'

dayjs.extend(duration)

interface Props {
  events: IEvent[]
  stages: IStage[]
}
export function Editor(props: Props) {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | undefined>()
  const [selectedStage, setSelectedStage] = useState<IStage | undefined>()
  const [selectedStream, setSelectedStream] = useState<StreamSession | undefined>()
  const [sessions, setSessions] = useState<ISession[]>([])

  const { data: streamSessions } = useStreamSessions(selectedStage?.streamSettings.streamId ?? '')

  // initialize default event and stage
  useEffect(() => {
    const event = props.events[0]
    const stage = props.stages.find((stage) => stage.eventId === event?.id)
    setSelectedEvent(event)
    setSelectedStage(stage)
  }, [props.events, props.stages])

  // auto select stream sessions from Livepeer
  useEffect(() => {
    const streams = filterStreams(streamSessions ?? [])
    const stream = streams[0]
    setSelectedStream(stream)
  }, [streamSessions, selectedStage])

  // fetch schedule info
  useEffect(() => {
    async function fetchSchedule() {
      if (selectedEvent && selectedStage && selectedStream) {
        const res = await fetch(`${apiUrl()}/organizations/${selectedEvent.organizationId}/events/${selectedEvent.id}/sessions`)
        const data: ISession[] = await res.json()

        // filter sessions by stage and streaming day
        const filtered = data.filter(
          (i) => i.stageId === selectedStage?.id && dayjs(i.start).format('YYYYMMDD') === dayjs(selectedStream.createdAt).format('YYYYMMDD')
        )

        setSessions(filtered)
      }
    }
    fetchSchedule()
  }, [selectedEvent, selectedStage, selectedStream])

  function selectEvent(eventId: string) {
    const event = props.events.find((i) => i.id === eventId)
    const stage = props.stages.filter((i) => i.eventId === eventId)[0]

    setSelectedEvent(event)
    setSelectedStage(stage)
  }

  function selectStage(stageId: string) {
    const stage = props.stages.find((i) => i.id === stageId)
    setSelectedStage(stage)
  }

  function selectStream(streamId: string) {
    const stream = streamSessions?.find((i) => i.id === streamId)
    setSelectedStream(stream)
  }

  function filterStreams(streams: StreamSession[]) {
    return streams.filter((i) => !i.isActive && i.record && i.sourceSegmentsDuration && i.sourceSegmentsDuration > 3600)
  }

  return (
    <div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 font-light w-96 shrink-0">
          <select onChange={(e) => selectEvent(e.target.value)} className="p-2 h-12 border w-full rounded text-sm  bg-primary placeholder:text-sm">
            {props.events.map((event, index) => (
              <option key={index} className="cursor-pointer py-1" value={event.id} selected={event.id === selectedEvent?.id}>
                {event.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => selectStage(e.target.value)} className="p-2 h-12 border w-full rounded text-sm  bg-primary placeholder:text-sm">
            {props.stages
              .filter((i) => i.eventId === selectedEvent?.id)
              .map((event, index) => (
                <option key={index} className="cursor-pointer py-1" value={event.id}>
                  {event.name}
                </option>
              ))}
          </select>

          {streamSessions && streamSessions.length > 0 && (
            <select onChange={(e) => selectStream(e.target.value)} className="p-2 h-12 border w-full rounded text-sm  bg-primary placeholder:text-sm">
              {filterStreams(streamSessions).map((stream, index) => (
                <option key={index} className="cursor-pointer py-1" value={stream.id}>
                  {dayjs(stream.createdAt).format('MMM DD, HH:mm')} - {dayjs.duration(stream.sourceSegmentsDuration ?? 0, 'second').format('H')} hours{' '}
                  {dayjs.duration(stream.sourceSegmentsDuration ?? 0, 'second').format('mm')} mins
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="w-full h-full">
          {selectedStream && selectedStream.recordingUrl && (
            <VideoPlayer
              options={{
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [
                  {
                    src: selectedStream.recordingUrl,
                  },
                ],
              }}
            />
          )}
          {!selectedStream?.recordingUrl && <p>No video stream available..</p>}
          {/* {selectedStream && <Player title="StreamETH Video editor" playbackId={selectedStream?.id} objectFit="cover" priority showTitle={false} />} */}
        </div>
      </div>

      {sessions && sessions.length > 0 && <SessionList sessions={sessions} streamUrl={selectedStream?.recordingUrl ?? ''} />}
    </div>
  )
}
