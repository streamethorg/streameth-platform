'use client'

import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { ISession } from '@/server/model/session'
import { apiUrl } from '@/server/utils'
import { Player, StreamSession, useStreamSessions } from '@livepeer/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'

dayjs.extend(duration)

interface Props {
  events: IEvent[]
  stages: IStage[]
}

const TEST_SESSIONS: any = [
  { id: 1, name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', start: 10 },
  { id: 2, name: 'Aenean bibendum est nec quam ornare.', start: 20 },
  { id: 3, name: 'Donec dapibus fermentum quam.', start: 30 },
  { id: 4, name: 'Et rhoncus ligula gravida.', start: 40 },
  { id: 5, name: 'Suspendisse sollicitudin sit amet orci nec ultrices.', start: 50 },
  { id: 6, name: 'Donec in magna in ipsum varius.', start: 60 },
]

export function Editor(props: Props) {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | undefined>()
  const [selectedStage, setSelectedStage] = useState<IStage | undefined>()
  const [selectedStream, setSelectedStream] = useState<StreamSession | undefined>()
  const [sessions, setSessions] = useState<ISession[]>(TEST_SESSIONS)
  const [edit, setEdit] = useState<any>({})

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
    console.log('STREAMS', streams)
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
          {selectedStream && selectedStream.recordingUrl && <VideoPlayer videoUrl={selectedStream.recordingUrl} />}
          {!selectedStream?.recordingUrl && <p>No video stream available..</p>}
          {/* {selectedStream && <Player title="StreamETH Video editor" playbackId={selectedStream?.id} objectFit="cover" priority showTitle={false} />} */}
        </div>
      </div>

      {sessions && sessions.length > 0 && (
        <div className="mt-4">
          <div className="max-h-96 overflow-y-auto">
            <table className="table-auto text-left shrink-0">
              <thead>
                <tr>
                  <th className="w-full">Title</th>
                  <th>Start (secs)</th>
                  <th>End (secs)</th>
                </tr>
              </thead>
              <tbody>
                {sessions
                  .sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf())
                  .map((i) => {
                    return (
                      <tr key={i.id} className="hover:bg-stone-200">
                        <td className="py-2">
                          <p className="ml-2 text-ellipsis overflow-hidden">{i.name}</p>
                        </td>
                        <td>
                          <input type="text" name="start" placeholder="Start" className="p-1 mr-2 w-24 text-sm border rounded" required />
                        </td>
                        <td>
                          <input type="text" name="end" placeholder="End" className="p-1  mr-2 w-24 text-sm border rounded" required />
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button className="p-2 bg-blue-500 text-white rounded" onClick={() => console.log('Process videos..')}>
              Process
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
