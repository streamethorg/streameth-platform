import EventController from '@/server/controller/event'
import SessionsOnSchedule from './components/SessionsOnGrid'
import ScheduleGrid from './components/ScheduleGrid'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import { apiUrl } from '@/server/utils'
import { ScheduleData } from '@/app/api/organizations/[id]/events/[eventId]/schedule/route'
const EventPage = async ({
  params,
}: {
  params: {
    organization: string
    event: string
  }
}) => {
  const eventController = new EventController()

  try {
    const event = await eventController.getEvent(params.event, params.organization)
    if (!hasData({ event })) return notFound()
    const schedule: ScheduleData = await (
      await fetch(`${apiUrl()}/organizations/${event.organizationId}/events/${event.id}/schedule`, { cache: 'no-cache' })
    ).json()

    return (
      <ScheduleGrid totalSlots={schedule.totalSlots} earliestTime={schedule.earliestTime}>
        {schedule &&
          schedule.data.map((item) => (
            <div className="flex flex-row right-0 h-full absolute top-0 w-[calc(100%-5rem)]">
              {item.stages.map((stage) => (
                <SessionsOnSchedule key={stage.name} sessions={stage.sessions} earliestTime={schedule.earliestTime} />
              ))}
            </div>
          ))}
      </ScheduleGrid>
    )
  } catch (e) {
    console.log(e)
    return notFound()
  }
}

export default EventPage
