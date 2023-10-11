import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import FilterBar from './components/FilterBar'

export default async function Home() {
  const eventController = new EventController()
  const allEvents = (await eventController.getAllEvents()).map((event) => {
    return event.toJson()
  })

  return (
      <main className="flex flex-col bg-background w-screen mx-auto lg:overflow-hidden">
        <FilterBar events={allEvents} />
        <EventList events={allEvents} />
      </main>
  )
}
