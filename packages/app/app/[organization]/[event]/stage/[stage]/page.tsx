import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import Chat from '@/components/plugins/Chat'
import { EventPageProps } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchStage } from '@/lib/services/stageService'
import UpcomingSession from '../components/UpcomingSession'
import { notFound } from 'next/navigation'
import { generalMetadata, stageMetadata } from '@/lib/utils/metadata'
import { Metadata } from 'next'
import { fetchChat } from '@/lib/services/chatService'
import { Livepeer } from 'livepeer'
import { buildPlaybackUrl } from '@/lib/utils/utils'
export default async function Stage({ params }: EventPageProps) {
  if (!params.event || !params.stage) {
    return notFound()
  }

  const event = await fetchEvent({
    eventId: params.event,
  })

  const stage = await fetchStage({
    stage: params.stage,
  })

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  if (!event || !stage || !stage?._id) {
    return notFound()
  }

  const prevChatMessages = await fetchChat({ stageId: stage?._id })
  const stream = (
    await livepeer.stream.get(stage.streamSettings?.streamId ?? '')
  ).stream

  if (!stream || !stream.playbackId) {
    return notFound()
  }

  const sessionsData = await fetchAllSessions({ stageId: stage._id })
  const currentSession = sessionsData.sessions.find((s) => {
    return s.start < Date.now() && s.end > Date.now()
  })

  return (
    <div className="bg-event flex flex-col w-full md:flex-row relative lg:max-h-[calc(100vh-54px)] p-2 gap-2">
      <div className="flex flex-col w-full md:h-full md:overflow-auto z-40 md:w-full top-[54px] gap-2">
        <Player
          src={[
            {
              src: buildPlaybackUrl(
                stream.playbackId
              ) as `${string}m3u8`,
              width: 1920,
              height: 1080,
              mime: 'application/vnd.apple.mpegurl',
              type: 'hls',
            },
          ]}
        />
        <SessionInfoBox
          inverted
          title={'Watching: ' + stage.name}
          avatarUrl={event.logo}
          avatarFallback={event.name.slice(0, 1)}
          playerName={stage.name}
          playbackId={stream.playbackId}
          description={event.description}
        />
      </div>
      <div className="flex flex-col w-full lg:w-2/5 md:h-full z-40 top-[54px] gap-2">
        <UpcomingSession
          event={event}
          currentSession={currentSession}
        />
        <Chat
          prevChatMessages={prevChatMessages}
          stageId={stage?._id}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  if (!params.event || !params.stage) {
    return generalMetadata
  }

  const event = await fetchEvent({
    eventId: params.event,
  })

  const stage = await fetchStage({
    stage: params.stage,
  })

  if (!event || !stage) {
    return generalMetadata
  }

  return stageMetadata({
    event,
    stage,
  })
}
