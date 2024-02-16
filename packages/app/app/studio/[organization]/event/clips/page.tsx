import { ClipsPageParams } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import NoSession from './components/NoSession'
import SessionList from './components/SessionList'
import { notFound } from 'next/navigation'
import { PlayerWithControls } from '@/components/ui/Player'
import RecordingSelect from './components/RecordingSelect'
import { getStageStream } from '@/lib/actions/stages'
import { fetchStage } from '@/lib/services/stageService'
import { Livepeer } from 'livepeer'
import ClipStatus from './components/ClipStatus'
import TimeSetter from './components/TimeSetter'
import CreateClipButton from './components/CreateClipButton'
import { CardContent } from '@/components/ui/card'
import { ClipProvider } from './components/ClipContext'

const EventClips = async ({
  params,
  searchParams,
}: ClipsPageParams) => {
  const { eventId, stage, selectedSession } = searchParams
  if (!eventId || !stage) return notFound()

  const stageData = await fetchStage({ stage })

  if (!stageData) return notFound()
  const parentStream = stageData.streamSettings.streamId ?? ''

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const recordings = (
    await livepeer.session.getRecorded(parentStream)
  ).classes

  const sessions = (
    await fetchAllSessions({ event: eventId, stageId: stage })
  ).sessions

  const session = sessions.find((s) => s._id === selectedSession)

  if (sessions.length === 0) {
    return (
      <NoSession
        organization={params.organization}
        eventId={eventId}
      />
    )
  }

  return (
    <div className="flex flex-row h-full gap-2">
      <div className="flex flex-col w-2/6 border-none rounded-none overflow-auto h-full gap-2">
        <SessionList sessions={sessions} />
      </div>
      <div className="flex flex-col w-full h-full overflow-auto">
        {session ? (
          <div className="px-2 space-y-2">
            {session.name}
            <div>
              {session.assetId ? (
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
                  <></>
                  <RecordingSelect
                    streamRecordings={recordings ?? []}
                  />
                  <div className="flex flex-row w-full space-x-1 items-center">
                    <TimeSetter label="Clip start" type="start" />
                    <TimeSetter label="Clip end" type="end" />
                    <CreateClipButton
                      playbackId={parentStream}
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
