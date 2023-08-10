// `app` directory
import StageLayout from './components/StageLayout'
import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
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
  const stageController = new StageController()
  try {
    const stage = await stageController.getStage(params.stage, params.event)
    return <StageLayout stage={stage} />
  } catch (e) {
    return notFound()
  }
}
