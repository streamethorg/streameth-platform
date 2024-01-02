import EventController from 'streameth-server/controller/event'
import SessionController from 'streameth-server/controller/session'
import FilteredItems from './components/FilteredItems'
import type { Metadata, ResolvingMetadata } from 'next'
import coverImage from '@/public/cover.png'
interface Params {
  params: {
    event: string
    organization: string
  }
}

export default async function ArchivePage({ params }: Params) {
  const eventController = new EventController()
  const sessionController = new SessionController()
  const sessions = (
    await sessionController.getAllSessions({ eventId: params.event })
  ).map((session) => {
    return session.toJson()
  })

  const coverImage2 =
    (
      await eventController.getEvent(
        params.event,
        params.organization
      )
    ).eventCover ?? ''

  const videoSessions = sessions.filter((session) => {
    return session.videoUrl != undefined
  })

  if (videoSessions === undefined || videoSessions.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-full lg:overflow-hidden">
        <span className="text-2xl font-bold text-center">
          No videos are uploaded yet
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-start lg:flex-row w-full lg:h-full lg:overflow-hidden">
      <FilteredItems
        sessions={videoSessions}
        coverImage={coverImage2}
      />
    </div>
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const eventController = new EventController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  const imageUrl = event.eventCover
    ? event.eventCover
    : event.id + '.png'

  return {
    title: `${event.name} - Archive`,
    description: `Watch all the Streameth videos from ${event.name} here`,
    openGraph: {
      images: [imageUrl],
    },
  }
}
