import EventController from '@/server/controller/event'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import Link from 'next/link'
import StageController from '@/server/controller/stage'
import SpeakerPageComponent from './speakers/components/SpeakerPageComponent'
import SchedulePageComponent from './schedule/components/SchedulePageComponent'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import { ResolvingMetadata, Metadata } from 'next'

interface Params {
  params: {
    event: string
    organization: string
    speaker: string
  }
}

const Button = ({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) => (
  <div className="flex flex-row justify-center">
    <Link href={link}>
      <button className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">
        {children}
      </button>
    </Link>
  </div>
)

export default async function EventHome({ params }: Params) {
  const eventController = new EventController()

  const event = (
    await eventController.getEvent(params.event, params.organization)
  ).toJson()

  const stages = (
    await new StageController().getAllStagesForEvent(params.event)
  ).map((stage) => stage.toJson())

  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full h-full bg-accent px-2">
      <div className=" relative my-1 md:my-4 max-w-full md:max-w-4xl mx-auto z-50">
        <HomePageLogoAndBanner event={event} />
        <SchedulePageComponent params={params} />
        <SpeakerPageComponent params={params} />
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { organization, event } = params
  const eventController = new EventController()
  const eventInfo = await eventController.getEvent(
    event,
    organization
  )

  const imageUrl = eventInfo.eventCover
  try {
    return {
      title: eventInfo.name,
      description: eventInfo.description,
      openGraph: {
        images: [imageUrl!],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: eventInfo.name,
      description: eventInfo.description,
    }
  }
}
