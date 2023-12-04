import { notFound } from 'next/navigation'
import Link from 'next/link'
import SpeakerPageComponent from './speakers/components/SpeakerPageComponent'
import SchedulePageComponent from './schedule/components/SchedulePageComponent'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import { ResolvingMetadata, Metadata } from 'next'
import Player from '@/components/misc/Player'
import EventController from 'streameth-server/controller/event'
import StageController from 'streameth-server/controller/stage'
import { hasData } from '@/utils'

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
        <div className="bg-base  text-white p-4 rounded-xl">
          <span className=" w-full text-xl uppercase md:text-4xl flex ">
            Livestreams
          </span>
          <div className="grid py-4 md:grid-cols-2 gap-4">
            {stages
              .filter((stage) => stage?.streamSettings?.streamId)
              .map((stage) => (
                <Link
                  className="w-full md:w-full"
                  key={stage.id}
                  href={`/${params.organization}/${params.event}/stage/${stage.id}`}>
                  <div className="bg-black p-2 rounded-xl cursor-pointer space-y-2 w-full">
                    <Player
                      streamId={stage.streamSettings.streamId}
                      playerName={stage.id}
                      muted={true}
                    />
                    <p className="uppercase text-xl">{stage.name}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
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

  const imageUrl = eventInfo.banner
  try {
    return {
      title: eventInfo.name,
      description: eventInfo.description,
      openGraph: {
        title: eventInfo.name,
        description: eventInfo.description,
        images: [`/events/${imageUrl!}`],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: 'StreamETH Event',
    }
  }
}
