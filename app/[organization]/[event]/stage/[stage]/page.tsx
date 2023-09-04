import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import { getSessions } from '@/utils/api'
import { getEventDays, isSameDay } from '@/utils/time'
import EventController from '@/server/controller/event'
import StageLayout from './components/StageLayout'
import { StageContextProvider } from './components/StageContext'
interface Params {
  params: {
    organization: string
    event: string
    stage: string
  }
}

export async function generateStaticParams({ params: { organization, event } }: { params: { organization: string; event: string } }) {
  const stageController = new StageController()
  const stages = (await stageController.getAllStages()).map((stage) => {
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
  try {
    const event = await eventController.getEvent(params.event, params.organization)
    const stage = await stageController.getStage(params.stage, params.event)
    const days = getEventDays(event.start, event.end)
    const currentDay = days.find((day) => isSameDay(day, new Date().getTime()))

    const sessions = await getSessions({
      event,
      date: currentDay ? currentDay : days[0],
      stage: params.stage,
      timestamp: new Date().getTime(),
    })


    if (!sessions.length) return <></>

    return (
      <StageContextProvider stage={stage} sessions={sessions}>
        <StageLayout />
      </StageContextProvider>
    )
  } catch (e) {
    return notFound()
  }
}
