import EventController from '@/server/controller/event'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import Link from 'next/link'
import SpeakerPageComponent from './speakers/page'
import SchedulePageComponent from './schedule/page'
import MarkDownComp from './components/MarkDownComp'

interface Params {
  event: string
  organization: string
  speaker: string
}

// const Button = ({ children, link }: { children: React.ReactNode; link: string }) => (
//   <div className="flex flex-row justify-center">
//     <Link href={link}>
//       <button className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">{children}</button>
//     </Link>
//   </div>
// )

const EventHome = async ({ params }: { params: Params }) => {
  const eventController = new EventController()

  const event = await eventController.getEvent(params.event, params.organization)
  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full overflow-scroll h-full space-y-[5em] ">
      <div>
        {/* <HomePageLogoAndBanner event={event.toJson()} /> */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex flex-col p-4">
            <div className=" flex-col flex space-y-2 my-4 md:flex-col">
              <MarkDownComp params={params} />
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
