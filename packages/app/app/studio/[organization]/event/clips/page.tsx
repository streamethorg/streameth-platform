import { ClipsPageParams } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import NoSession from './components/NoSession'
import SessionList from './components/SessionList'
import { notFound } from 'next/navigation'
import { PlayerWithControls } from '@/components/ui/Player'
import RecordingSelect from './components/RecordingSelect'
import { fetchStage } from '@/lib/services/stageService'
import ClipStatus from './components/ClipStatus'
import TimeSetter from './components/TimeSetter'
import CreateClipButton from './components/CreateClipButton'
import { ClipProvider } from './components/ClipContext'
import ReactHlsPlayer from './components/Player'
import { Livepeer } from 'livepeer'
import { fetchEvent } from '@/lib/services/eventService'

const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const { eventId, stage, selectedSession, selectedRecording } =
    searchParams
  if (!eventId || !stage) return notFound()

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const stageData = await fetchStage({ stage })

  if (!stageData) return notFound()
  const parentStream = (
    await livepeer.stream.get(stageData.streamSettings.streamId ?? '')
  ).stream
  const recordings = (
    await livepeer.session.getRecorded(parentStream?.id ?? '')
  ).classes
  const sessions = (await fetchAllSessions({ stageId: stage }))
    .sessions

  const session = sessions.find((s) => s._id === selectedSession)

  const event = await fetchEvent({ eventId })

  if (!event || !parentStream || !parentStream.playbackId)
    return notFound()

  if (sessions.length === 0) {
    return (
      <NoSession
        stageId={stage}
        organization={event.organizationId as string}
        eventId={eventId}
      />
    )
  }

  return (
    <div className="flex flex-row h-full gap-2">
      <div className="flex flex-col w-2/6 border-none rounded-none overflow-auto h-full gap-2">
        <SessionList
          sessions={sessions}
          eventId={eventId}
          organizationId={event.organizationId as string}
          stageId={stage}
        />
      </div>
      <div className="flex flex-col w-full h-full overflow-auto">
        {session ? (
          <div className="px-2 space-y-2">
            {session.name}
            <div>
              {false ? (
                <>
                  <PlayerWithControls
                    src={[
                      {
                        src: session.videoUrl as `${string}m3u8`,
                        width: 1920,
                        height: 1080,
                        mime: 'application/vnd.apple.mpegurl',
                        type: 'hls',
                      },
                    ]}
                  />
                  <ClipStatus assetId={session.assetId} />
                </>
              ) : (
                <ClipProvider>
                  <ReactHlsPlayer
                    playbackId={parentStream?.playbackId}
                    selectedStreamSession={selectedRecording}
                  />
                  ,
                  <RecordingSelect
                    streamRecordings={JSON.parse(
                      JSON.stringify(recordings)
                    )}
                  />
                  <div className="flex flex-row w-full space-x-1 items-center">
                    <TimeSetter label="Clip start" type="start" />
                    <TimeSetter label="Clip end" type="end" />
                    <CreateClipButton
                      selectedRecording={selectedRecording}
                      playbackId={parentStream?.playbackId}
                      session={session}
                    />
                  </div>
                </ClipProvider>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl">Select a session</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventClips
