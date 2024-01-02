import { notFound } from 'next/navigation'
import SpeakerPageComponent from './speakers/components/SpeakerPageComponent'
import SchedulePageComponent from './schedule/components/SchedulePageComponent'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import { getImageUrl } from '@/utils'
import { ResolvingMetadata, Metadata } from 'next'
import LivestreamsSection from './components/LivestreamsSection'
import NFTMintComponent from './components/NFTMintComponent'
import { fetchEvent, fetchEventStages } from '@/lib/data'

interface Params {
  params: {
    event: string
    organization: string
  }
  searchParams: {
    stage?: string
    date?: string
  }
}

export default async function EventHome({
  params,
  searchParams,
}: Params) {
  const event = await fetchEvent({
    event: params.event,
    organization: params.organization,
  })

  const stages = await fetchEventStages({
    event: params.event,
  })

  if (!event) return notFound()

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
        <SchedulePageComponent
          stages={stages}
          event={event}
          stage={searchParams.stage}
          date={searchParams.date}
        />
        <SpeakerPageComponent event={event} />
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { organization, event } = params
  const eventInfo = await fetchEvent({
    event,
    organization,
  })

  if (!eventInfo) {
    return {
      title: 'StreamETH Event',
    }
  }

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
