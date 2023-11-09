import StreamethApi from '@/server/services/streameth'
import EventList from '@/app/(home)/components/EventList'
import FilterBar from './components/FilterBar'
import Image from 'next/image'
import UpcomingEvents from './components/UpcomingEvents'
import IEvent from '@/server/model/event'
export default async function Home() {
  const allEvents = await StreamethApi.get<IEvent[]>({
    path: '/events',
  })

  const upComing = allEvents
    .filter((event) => {
      return event.organizationId === 'devconnect'
    })
    .sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime()
    })

  const pastEvents = allEvents.filter(
    (event) =>
      new Date(event.start).getTime() < new Date().getTime()
  )

  return (
    <main className="w-screen mx-auto">
      <div className="sticky top-0 z-[9999] bg-accent flex px-8 p-4 gap-4">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          alt="Streameth logo"
        />
      </div>
      <div className="flex flex-col p-4 lg:overflow-hidden">
        <p className="px-4 mt-3 font-ubuntu font-bold text-blue text-xl">
          Upcoming Events
        </p>
        <UpcomingEvents events={upComing} />
        <div className="px-4 items-center space-y-2 space-x-4 flex flex-col md:flex-row mt-4 ">
          <p className="font-ubuntu font-bold text-blue text-xl">
            Past Events
          </p>
          <FilterBar events={pastEvents} />
        </div>
        <EventList events={pastEvents} />
      </div>
    </main>
  )
}
