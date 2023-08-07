import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import FilterBar from './components/FilterBar'
import { FilterContextProvider } from '@/app/[organization]/[event]/archive/components/FilterContext'
export default async function Home() {
  const eventController = new EventController()
  const allEvents = (await eventController.getAllEvents()).map((event) => {
    return event.toJson()
  })

  return (
    <FilterContextProvider items={allEvents}>
      <main className="flex flex-col bg-background w-screen m-auto lg:overflow-hidden">
        <FilterBar events={allEvents} />
        <EventList />
      </main>
    </FilterContextProvider>
  )
}
