import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import FilterBar from './components/FilterBar'

export default async function Home() {
  const eventController = new EventController()
  const upComing = (await eventController.getAllEvents({})).map(
    (event) => {
      return event.toJson()
    }
  )

  // const pastEvents = (await eventController.getAllEvents({}))
  //   .map((event) => {
  //     return event.toJson()
  //   })
  //   .filter((event) => {
  //     return new Date(event.start).getTime() < new Date().getTime()
  //   })

  return (
    <main className="flex flex-col  w-screen mx-auto  p-4 lg:overflow-hidden">
      <FilterBar events={upComing} />
      {/* <p>Upcoming events</p> */}
      <EventList events={upComing} />
      {/* <p>Past events</p>
      <EventList events={pastEvents} /> */}
    </main>
  )
}
