import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import { getEventDays, isSameDay } from '@/utils/time'
import EventController from '@/server/controller/event'
import StageLayout from './components/StageLayout'
import { StageContextProvider } from './components/StageContext'
import type { Metadata, ResolvingMetadata } from 'next'
import SessionController from '@/server/controller/session'
interface Params {
  params: {
    organization: string
    event: string
    stage: string
  }
}

export async function generateStaticParams({
  params: { organization, event },
}: {
  params: { organization: string; event: string }
}) {
  const stageController = new StageController()
  const stages = (
    await stageController.getAllStagesForEvent(event)
  ).map((stage) => {
    return {
      organization: organization,
      event: event,
      stage: stage.id,
    }
  })
  return stages
}

export default async function Stage({ params }: Params) {
  const eventController = new EventController()
  const stageController = new StageController()
  const sessionController = new SessionController()
  try {
    const event = await eventController.getEvent(
      params.event,
      params.organization
    )
    const stage = await stageController.getStage(
      params.stage,
      params.event
    )
    const days = getEventDays(event.start, event.end)
    const currentDay = days.find((day) =>
      isSameDay(day, new Date().getTime())
    )

    const sessions = await sessionController.getAllSessions({
      eventId: event.id,
      stage: params.stage,
      timestamp: new Date().getTime(),
    })

    if (!sessions.length)
      return (
        <div className="justify-center items-center w-full">
          Stage has nothing scheduled
        </div>
      )

    return (
      <StageContextProvider
        stage={stage.toJson()}
        sessions={sessions}>
        <StageLayout />
      </StageContextProvider>
    )
  } catch (e) {
    console.log('stage failed to load', e)
    return notFound()
  }
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
  const imageName = event.eventCover
    ? event.eventCover
    : event.id + '.png'
  const imageUrl = 'https://app.streameth.org/public/' + imageName
  return {
    title: `${event.name} - ${params.stage}`,
    description: `Attend ${event.name} virtually powered by streameth here`,
    openGraph: {
      images: [imageUrl],
    },
  }
}
