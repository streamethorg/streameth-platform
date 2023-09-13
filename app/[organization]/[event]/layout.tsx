import Navbar from '@/components/Layout/Navbar'
import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import {
  HomeIcon,
  ArchiveBoxArrowDownIcon,
  ViewColumnsIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'
import SessionController from '@/server/controller/session'

export async function generateStaticParams() {
  const eventController = new EventController()
  const allEvents = await eventController.getAllEvents()
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
  const sessionController = new SessionController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  const stages = await stageController.getAllStagesForEvent(
    params.event
  )
  const sessions = await sessionController.getAllSessions({
    eventId: params.event,
  })

  if (!event) {
    return notFound()
  }

  const pages = [
    {
      href: `/${params.organization}/${params.event}`,
      name: 'Home',
      icon: <HomeIcon />,
    },
    {
      href: `/${params.organization}/${params.event}/schedule`,
      name: 'Schedule',
      icon: <CalendarIcon />,
    },
    {
      href: `/${params.organization}/${params.event}/speakers`,
      name: 'Speakers',
      icon: <UserGroupIcon />,
    },
  ]

  return (
    <div className="flex flex-col md:flex-row overflow-auto lg:overflow-hidden h-full">
      {!event.archiveMode && (
        <Navbar
          event={event.toJson()}
          pages={pages}
          stages={stages.map((stage) => {
            return {
              href: `/${params.organization}/${stage.eventId}/stage/${stage.id}`,
              name: stage.name,
              icon: <ViewColumnsIcon />,
            }
          })}
        />
      )}
      <main
        className={`flex w-full ${
          event.archiveMode ? ' lg:w-full' : 'lg:w-[calc(100%-5rem)]'
        } ml-auto bg-background`}>
        {children}
      </main>
    </div>
  )
}

export default Layout
