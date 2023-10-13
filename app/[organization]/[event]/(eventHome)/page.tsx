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
    <div className="flex flex-col w-full overflow-scroll h-full gap-4 ">
      <HomePageLogoAndBanner event={event.toJson()} />
      <div className="p-4">
      <div className="flex-col mt-0 flex max-w-4xl mx-auto space-y-4 shadow bg-white p-4 rounded m-4 box-content">
        <div className=" flex-col flex space-y-2 md:flex-row items-center">
          <h1 className="font-bold text-xl py-2">{event.name}</h1>
          <Link
            className="bg-accent font-bold h-8 border-2 hover:text-accent hover:bg-white animate-bounce text-white border-accent px-2 mx-2 rounded"
            href={
              'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NmFqZGU4dmVxcGgzanNxYjlzYjV1MXB0MGEgY19mZDE2YjdhZTIxZDA2NWI4OTUxYTU0MzM3NDQ1MTQ3MjEyYWI1OThhMjAzNzFlZjEzMjBjZWQ5ZWUzOWNhNTc0QGc&tmsrc=c_fd16b7ae21d065b8951a54337445147212ab598a20371ef1320ced9ee39ca574%40group.calendar.google.com'
            }>
            add this event to your calendar
          </Link>
        </div>
        <p>{event.description}</p>
        <div className="flex flex-row flex-wrap justify-center items-center p-4">
          <StageModalButton stages={stages} />
          <Button link={`/${params.organization}/${params.event}/schedule`}>Schedule</Button>
          <Button link={`/${params.organization}/${params.event}/speakers`}>Speakers</Button>
          {/* <Button link={`/${params.organization}/${params.event}/archive`}>Archive</Button> */}
        </div>
        </div>
      </div>
    </div>
  )
}

export default EventHome
