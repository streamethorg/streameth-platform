import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import FilterBar from './components/FilterBar'
import Image from 'next/image'
import LiveEvent from './components/LiveEvent'
import StageController from '@/server/controller/stage'
import Card from '@/components/misc/Card'
import UpcomingEvents from './components/UpcomingEvents'
import HotTalks from './components/HotTalks'

export default async function Home() {
  const eventController = new EventController()
  const upComing = (await eventController.getAllEvents({}))
    .map((event) => {
      return event.toJson()
    })
    .filter((event) => {
      return event.organizationId === 'devconnect'
    })
    .sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime()
    })

  const pastEvents = (await eventController.getAllEvents({}))
    .filter(
      (event) =>
        new Date(event.toJson().start).getTime() <
        new Date().getTime()
    )
    .map((event) => {
      return event.toJson()
    })

  const stageController = new StageController()
  const stage = await stageController.getStage(
    'theater',
    'zuconnect__decentralized_social_track'
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
        <FilterBar events={upComing} />
      </div>
      <div className="flex flex-col p-4 lg:overflow-hidden">
        <LiveEvent stage={stage?.toJson()} />

        {/* <HotTalks /> */}
        <p className="px-4 mt-3 font-ubuntu font-bold text-blue text-xl">
          Upcoming Events
        </p>
        <UpcomingEvents events={upComing} />
        <p className="px-4 mt-3 font-ubuntu font-bold text-blue text-xl">
          Past Events
        </p>
        <EventList events={pastEvents} />
      </div>
    </main>
  )
}
