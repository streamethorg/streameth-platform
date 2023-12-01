import EventList from '@/app/(home)/components/EventList'
import EventController from 'streameth-server/controller/event'

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
    <main className="flex flex-col bg-background w-screen mx-auto lg:overflow-hidden">
      {/* <FilterBar events={allEvents} /> */}
      {/* <p>Upcoming events</p> */}
      <EventList events={upComing} />
      {/* <p>Past events</p>
      <EventList events={pastEvents} /> */}
    </main>
  )
}
