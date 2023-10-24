import EventController from '@/server/controller/event'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import Link from 'next/link'
import SpeakerPageComponent from './speakers/page'
import SchedulePageComponent from './schedule/page'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
interface Params {
  event: string
  organization: string
  speaker: string
}

const Button = ({ children, link }: { children: React.ReactNode; link: string }) => (
  <div className="flex flex-row justify-center">
    <Link href={link}>
      <button className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">{children}</button>
    </Link>
  </div>
)

{
  /* <Link
className="bg-accent font-bold border-2 hover:text-accent  hover:bg-white  text-white border-accent px-2 py-1  rounded max-w-[8rem]"
href={
  'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NmFqZGU4dmVxcGgzanNxYjlzYjV1MXB0MGEgY19mZDE2YjdhZTIxZDA2NWI4OTUxYTU0MzM3NDQ1MTQ3MjEyYWI1OThhMjAzNzFlZjEzMjBjZWQ5ZWUzOWNhNTc0QGc&tmsrc=c_fd16b7ae21d065b8951a54337445147212ab598a20371ef1320ced9ee39ca574%40group.calendar.google.com'
}>
save the date
</Link> */
}
const EventHome = async ({ params }: { params: Params }) => {
  const eventController = new EventController()

  const event = await eventController.getEvent(params.event, params.organization)
  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full overflow-scroll h-full space-y-[5em] ">
      <div id="home">
        <HomePageLogoAndBanner event={event.toJson()} />
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex flex-col p-4">
            <div className=" flex-col flex space-y-2 my-4 md:flex-col">
              <h1 className="text-4xl py-4 text-center md:text-left font-bold">{event.name}</h1>
              <div className=" flex flex-col space-y-4 text-left">
                <p>
                  <span className="mr-2">&#128197;</span>When: {new Date(event.start).toDateString()}
                </p>
                <p>
                  <span className="mr-2">&#9200;</span> Time: {new Date(event.start).toLocaleTimeString()}
                </p>
                <p>
                  <span className="mr-2">&#127759;</span> Where: {event.location}
                </p>
                <p>{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SpeakerPageComponent params={params} />
      <SchedulePageComponent params={params} />
    </div>
  )
}

export default EventHome
