import { notFound } from 'next/navigation'
import SpeakerPageComponent from './speakers/components/SpeakerPageComponent'
import SchedulePageComponent from './schedule/components/SchedulePageComponent'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import EventController from 'streameth-server/controller/event'
import StageController from 'streameth-server/controller/stage'
import { getImageUrl, hasData } from '@/utils'
import { ResolvingMetadata, Metadata } from 'next'
import LivestreamsSection from './components/LivestreamsSection'
import NFTMintComponent from './components/NFTMintComponent'

interface Params {
  params: {
    event: string
    organization: string
    speaker: string
  }
}

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
        <NFTMintComponent />
        <LivestreamsSection
          stages={stages}
          params={params}
          event={event}
        />
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
        title: eventInfo.name,
        description: eventInfo.description,
        images: [getImageUrl(`/events/${imageUrl!}`)],
      },
      twitter: {
        card: 'summary_large_image',
        title: eventInfo.name,
        description: eventInfo.description,
        images: {
          url: getImageUrl(`/events/${imageUrl!}`),
          alt: eventInfo.name + ' Logo',
        },
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: 'StreamETH Event',
    }
  }
}
