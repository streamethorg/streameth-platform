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
  // Fetch sessions data

  if (!event || !stage) {
    return notFound()
  }

  const sessionsData = await fetchAllSessions({ stageId: stage._id })
  const currentSession = sessionsData.sessions[0]

  return (
    <div className="bg-event flex flex-col w-full md:flex-row relative lg:max-h-[calc(100vh-54px)] p-2 gap-2">
      <div className="flex flex-col w-full md:h-full z-40 md:w-full top-[54px] gap-2">
        <Player
          streamId={stage.streamSettings?.streamId}
          playerName={stage.name}
        />
        <SessionInfoBox
          inverted
          title={'Watching: ' + stage.name}
          avatarUrl={event.logo}
          avatarFallback={event.name.slice(0, 1)}
          playerName={stage.name}
          streamId={stage.streamSettings?.streamId}
          description={event.description}
        />
      </div>
      <div className="flex flex-col w-full lg:w-2/5 md:h-full z-40 top-[54px] gap-2">
        <UpcomingSession
          event={event}
          currentSession={currentSession}
        />
        <Chat conversationId="" />
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
