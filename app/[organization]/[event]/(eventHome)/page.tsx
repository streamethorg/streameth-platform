import EventController from '@/server/controller/event'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import Link from 'next/link'
import SpeakerPageComponent from './speakers/page'
import SchedulePageComponent from './schedule/page'

interface Params {
  event: string
  organization: string
  speaker: string
}

const Button = ({ children, link }: { children: React.ReactNode; link: string }) => (
  <div className="flex flex-row justify-center">
    <Link href={link}>
      <button className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">{children}</button>
    </Link>
  </div>
)

const EventHome = async ({ params }: { params: Params }) => {
  const eventController = new EventController()

  const event = await eventController.getEvent(params.event, params.organization)
  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full overflow-scroll h-full space-y-[5em] ">
      <div>
        {/* <HomePageLogoAndBanner event={event.toJson()} /> */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex flex-col p-4">
            <div className=" flex-col flex space-y-2 my-4 md:flex-col">
              <h1 className="text-4xl py-4 text-center md:text-left font-bold">{event.name}</h1>
              <div className=" flex flex-col space-y-4 text-left">
                <p>&#128197; When: October 20th</p>
                <p>&#9200; Time: 9:00 AM - 11:50 AM EST / 1:00 PM - 3:50 PM UTC</p>
                <p>&#127759; Where: Live in Vietnam and Online</p>
                <p>&#128421; Streamed @ launch.scroll.io</p>
                <Link
                  className=" text-center animate-pulse bg-accent font-bold border-2 hover:text-accent  hover:bg-white  text-white border-accent px-2 py-1  rounded max-w-[12rem]"
                  href={"/scroll/scroll_announcement_stream/stage/virtual_stage"
                  }>
                  Watch livestream!
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <p>
                Join us on Friday, October 20th, as we celebrate a monumental moment in Scroll{"'"}s journey - the launch of our Mainnet. It{"'"}s a
                big step forward, and we want to share it with you. We{"'"}re bringing together a group of friends from The Graph, Aave/Lens, Dora,
                and more to mark this occasion. We{"'"}ll be diving into a range of topics, but most importantly, we{"'"}ll be opening the floor for
                an authentic conversation with community leaders from Latin America, Africa, and Southeast Asia. Together, we{"'"}ll explore how zk
                technology is creating exciting new opportunities in these regions.
              </p>
              <p>
                If you{"'"}re a developer, join us for a hands-on build session. We{"'"}re rolling up our sleeves and guiding you through the process
                of deploying on Scroll. Here{"'"}s a sneak peek at some of the incredible minds you{"'"}ll be hearing from:
              </p>
              <ul className="">
                <li className=" list-item">Bunny (Dora)</li>
                <li>Nader (Lens)</li>
                <li>CTRLV (Cog)</li>
                <li>Pranav (The Graph)</li>
                <li>Simona Pop (ENS)</li>
              </ul>
              <p>
                But that{"'"}s not all. We{"'"}ve got a Founder conversation lined up. We{"'"}ll discuss what{"'"}s next post-mainnet launch, sharing
                our vision, the challenges we{"'"}ve overcome, and the exciting journey ahead for Scroll. So, what{"'"}s on Scroll{"'"}s horizon? We
                {"'"}ll reveal the areas we{"'"}re focusing on and how you can be a part of it. Save the Date now, and let{"'"}s celebrate together at
                launch.scroll.io.
              </p>
              <p>
                Cheers,<br></br>
                The Scroll Team
              </p>
            </div>
          </div>
        </div>
      </div>
      <SpeakerPageComponent params={params} />
      <SchedulePageComponent params={params} />
    </div>
  )
}

export default EventHome
