import EventController from '@/server/controller/event'
import EventList from '@/app/(home)/components/EventList'
import FilterBar from './components/FilterBar'
import Image from 'next/image'
import StageController from '@/server/controller/stage'
import UpcomingEvents from './components/UpcomingEvents'
import { SocialIcon } from 'react-social-icons'
import Link from 'next/link'

export default async function Home() {
  const eventController = new EventController()
  const upComing = (await eventController.getAllEvents({}))
    .map((event) => {
      return event.toJson()
    })
    .filter((event) => {
      return (
        event.organizationId === 'devconnect' ||
        new Date(event.start) > new Date()
      )
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
    'zuconnect_hackathon'
  )

  return (
    <main className="w-screen mx-auto">
      <div className="drop-shadow-sm sticky top-0 z-[9999] h-20 bg-accent flex p-2 md::px-8 md:p-4 gap-4">
        <Image
          className="hidden md:block"
          src="/logo_dark.png"
          alt="Streameth logo"
          width={276}
          height={46}
        />
        <Image
          className="block md:hidden aspect-square h-full p-1"
          src="/logo.png"
          alt="Streameth logo"
          height={64}
          width={64}
        />
        <div className="flex flex-row ml-auto space-x-2 items-center justify-center">
          <Link href="https://streameth.org/contact-us">
            <div className="bg-blue border-blue text-white p-2 rounded-xl border">
              Add your event
            </div>
          </Link>
          <SocialIcon url="https://x.com/streameth" />
          <SocialIcon url="https://github.com/streamethorg/streameth-platform" />
        </div>
      </div>
      <div className="flex flex-col lg:overflow-hidden">
        <p className="px-4 mt-3 font-ubuntu font-bold md:py-2 text-blue text-4xl">
          Upcoming Events
        </p>
        <UpcomingEvents events={upComing} />

        <EventList events={pastEvents} />
      </div>
    </main>
  )
}
