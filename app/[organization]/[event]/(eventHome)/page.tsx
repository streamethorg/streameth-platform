import EventController from '@/server/controller/event'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import Link from 'next/link'
import StageController from '@/server/controller/stage'
import SpeakerPageComponent from './speakers/components/SpeakerPageComponent'
import SchedulePageComponent from './schedule/components/SchedulePageComponent'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getEventLocalTime,
  getEventTime,
  getTime,
} from '@/utils/time'
interface Params {
  event: string
  organization: string
  speaker: string
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

const EventHome = async ({ params }: { params: Params }) => {
  const eventController = new EventController()

  const event = (
    await eventController.getEvent(params.event, params.organization)
  ).toJson()

  const stages = (
    await new StageController().getAllStagesForEvent(params.event)
  ).map((stage) => stage.toJson())

  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full overflow-scroll h-full space-y-[5em] ">
      <div className=" relative bg-white max-w-4xl rounded-lg mx-auto z-50 space-y-10">
        <HomePageLogoAndBanner event={event} />
        <div id="home" className="flex flex-col px-4 ">
          <div className=" flex-col flex space-y-2 md:flex-col">
            <h1 className="text-4xl text-left font-bold">
              {event.name}
            </h1>
            <div className=" flex flex-col space-y-4 text-left">
              <p>
                <span className="mr-2">&#128197;</span>When:{' '}
                {new Date(event.start).toDateString()}
              </p>
              <p>
                <span className="mr-2">&#9200;</span> Time:{' '}
                {event?.startTime
                  ? getEventLocalTime(event.startTime, event.timezone)
                  : 'TBD'}
              </p>
              <p>
                <span className="mr-2">&#127759;</span> Where:{' '}
                {event.location}
              </p>
              {/* <ReserveSpotButton event={event} /> */}
              <Link
                href={`/${params.organization}/${params.event}/livestream`}
                className="text-center p-2  border bg-accent text-white rounded text-lg hoover:text-accent w-[200px]">
                Watch livestream
              </Link>
              <article className="prose max-w-full prose-gray">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {event.description}
                </Markdown>
              </article>
            </div>
          </div>
        </div>
        <SpeakerPageComponent params={params} />
        <SchedulePageComponent params={params} />
      </div>
    </div>
  )
}

export default EventHome
