import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import SessionController from '@/server/controller/session'
import speakerController from '@/server/controller/speaker'
import ColorComponent from '../../utils/ColorComponent'
import Navbar from '@/components/Layout/NavbarTop'
export async function generateStaticParams() {
  const eventController = new EventController()
  const allEvents = await eventController.getAllEvents({})
  const paths = allEvents.map((event) => ({
    organization: event.organizationId,
    event: event.id,
  }))
  return paths
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    organization: string
    event: string
  }
}) => {
  const stageController = new StageController()
  const eventController = new EventController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  const stages = await stageController.getAllStagesForEvent(
    params.event
  )
  const sessions = await new SessionController().getAllSessions({
    eventId: params.event,
  })
  const speakers =
    await new speakerController().getAllSpeakersForEvent(params.event)

  if (!event) {
    return notFound()
  }

  return (
    <div className="h-full flex flex-col  z-1 bg-accent min-h-screen ">
      <Navbar />

      <main className={` flex w-full ml-auto md:h-full flex-grow`}>
        <ColorComponent
          event={event.toJson()}
          stages={stages.map((stage) => stage.toJson())}
          speakers={speakers.map((speaker) => speaker.toJson())}
          sessions={sessions.map((session) => session.toJson())}>
          {children}
        </ColorComponent>
      </main>
    </div>
  )
}

export default Layout
