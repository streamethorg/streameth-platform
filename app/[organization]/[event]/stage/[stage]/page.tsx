import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import { getScheduleData } from '@/utils/api'
import EventController from '@/server/controller/event'
import StageLayout from './components/StageLayout'

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
  try {
    const event = await eventController.getEvent(params.event, params.organization)
    const data = await getScheduleData({
      event,
      day: new Date().getTime().toString(),
      stage: params.stage,
      currentSession: true,
    })
    console.log(data)

    return <StageLayout data={data.days[new Date().getTime()].stages[params.stage]} />
  } catch (e) {
    return notFound()
  }
}
