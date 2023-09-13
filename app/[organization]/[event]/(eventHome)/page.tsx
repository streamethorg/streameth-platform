import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import { getEventDays } from '@/utils/time'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import Link from 'next/link'
import StageModalButton from './components/StageModalButton'

interface Params {
  event: string
  organization: string
}

const Button = ({ children, link }: { children: React.ReactNode; link: string }) => (
  <div className="flex flex-row justify-center">
    <Link href={link}>
      <button className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">{children}</button>
    </Link>
  </div>
)

const EventHome = async ({ params }: { params: Params }) => {
  const eventController = new EventController()

  const event = await eventController.getEvent(params.event, params.organization)
  const stages = (await new StageController().getAllStagesForEvent(params.event)).map((stage) => stage.toJson())
  const dates = getEventDays(event.start, event.end)
  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full ">
      <HomePageLogoAndBanner event={event.toJson()} />
      <div className="flex-col mt-16  flex max-w-4xl mx-auto p-4 space-y-4 ">
        <h1 className="font-bold text-xl">{event.name}</h1>
        <p>{event.description}</p>
        <div className="flex flex-row flex-wrap justify-center items-center p-4">
          <StageModalButton stages={stages} />
          <Button link={`/${params.organization}/${params.event}/schedule`}>Schedule</Button>
          <Button link={`/${params.organization}/${params.event}/speakers`}>Speakers</Button>
          <Button link={`/${params.organization}/${params.event}/archive`}>Archive</Button>
        
        </div>
      </div>
    </div>
  )
}

export default EventHome
