import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import { getEventDays } from '@/utils/time'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import Link from 'next/link'
import StageModalButton from './components/StageModalButton'
import Card from '@/components/misc/Card'
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
      <div className="max-w-4xl mx-auto mt-4">
        <div className="flex flex-col p-4 ">
          <div className=" flex-col flex space-y-2 md:flex-row items-center">
            <h1 className="text-4xl py-4 text-center">{event.name}</h1>
         
          </div>
          <div className="space-y-4">
            <p>
              After three successful testnets spanning over 15 months with extensive testing and rigorous security audits, users and builders are now
              free to explore Scroll’s zkEVM, a scaling solution nearly identical to Ethereum with lower cost, faster speed and limitless scaling
              potential.
            </p>
            <p>
              {' '}
              To celebrate this milestone with our global community, we are hosting a livestream event from our team off-site in Vietnam. You’ll
              hear from our founders, engineering and research teams, ecosystem projects, and other members of the global Ethereum community. We’ll
              also be sharing highlights from the past two weeks.
            </p>
            <p> Join us!</p>
            <div className="font-bold md:items-center flex flex-col md:flex-row  text-center md:text-left">
            When: October 20th, 8pm GMT +7
            <Link
              className="bg-accent font-bold border-2 hover:text-accent mt-2 md:mt-0 md:ml-2 hover:bg-white  text-white border-accent p-2  rounded"
              href={
                'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NmFqZGU4dmVxcGgzanNxYjlzYjV1MXB0MGEgY19mZDE2YjdhZTIxZDA2NWI4OTUxYTU0MzM3NDQ1MTQ3MjEyYWI1OThhMjAzNzFlZjEzMjBjZWQ5ZWUzOWNhNTc0QGc&tmsrc=c_fd16b7ae21d065b8951a54337445147212ab598a20371ef1320ced9ee39ca574%40group.calendar.google.com'
              }>
              add to cal
            </Link>
            </div>
          </div>

          {/* <div className="flex flex-row flex-wrap justify-center items-center p-4">
              <StageModalButton stages={stages} />
              <Button link={`/${params.organization}/${params.event}/schedule`}>Schedule</Button>
              <Button link={`/${params.organization}/${params.event}/speakers`}>Speakers</Button>
              <Button link={`/${params.organization}/${params.event}/archive`}>Archive</Button>
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default EventHome
