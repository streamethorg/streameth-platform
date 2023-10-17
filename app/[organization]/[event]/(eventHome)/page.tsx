import EventController from '@/server/controller/event'
import StageController from '@/server/controller/stage'
import { notFound } from 'next/navigation'
import { hasData } from '@/server/utils'
import { getEventDays } from '@/utils/time'
import HomePageLogoAndBanner from './components/HompageLogoAndBanner'
import Link from 'next/link'
import Markdown from 'react-markdown'
interface Params {
  event: string
  organization: string
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
  const stages = (await new StageController().getAllStagesForEvent(params.event)).map((stage) => stage.toJson())
  const dates = getEventDays(event.start, event.end)
  if (!hasData({ event })) return notFound()

  return (
    <div className="flex flex-col w-full overflow-scroll h-full gap-4 ">
      <HomePageLogoAndBanner event={event.toJson()} />
      <div className="max-w-4xl mx-auto mt-4">
        <div className="flex flex-col p-4 ">
          <div className=" flex-col flex space-y-2 my-4 md:flex-col">
            <h1 className="text-4xl py-4 text-center md:text-left">{event.name}</h1>
            <div className=" flex flex-col space-y-2 text-left">
              <p>&#128197; When: October 20th</p>
              <p>&#9200; Time: 9:00 AM - 10:30 AM EST / 1:00 PM - 2:30 PM UTC</p>
              <p>&#127759; Where: Live in Vietnam and Online</p>
              <p>&#128421; Streamed @ launch.scroll.io</p>
              <Link
                className="bg-accent font-bold border-2 hover:text-accent  hover:bg-white  text-white border-accent px-2 py-1  rounded max-w-[8rem]"
                href={
                  'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NmFqZGU4dmVxcGgzanNxYjlzYjV1MXB0MGEgY19mZDE2YjdhZTIxZDA2NWI4OTUxYTU0MzM3NDQ1MTQ3MjEyYWI1OThhMjAzNzFlZjEzMjBjZWQ5ZWUzOWNhNTc0QGc&tmsrc=c_fd16b7ae21d065b8951a54337445147212ab598a20371ef1320ced9ee39ca574%40group.calendar.google.com'
                }>
                save the date
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <p>
              Join us on Friday, October 20th, as we celebrate a monumental moment in Scroll{"'"}s journey - the launch of our Mainnet. It{"'"}s a big
              step forward, and we want to share it with you. We{"'"}re bringing together a group of friends from The Graph, Aave/Lens, Dora, and more
              to mark this occasion. We{"'"}ll be diving into a range of topics, but most importantly, we{"'"}ll be opening the floor for an authentic
              conversation with community leaders from Latin America, Africa, and Southeast Asia. Together, we{"'"}ll explore how zk technology is
              creating exciting new opportunities in these regions.
            </p>
            <p>
              If you{"'"}re a developer, join us for a hands-on build session. We{"'"}re rolling up our sleeves and guiding you through the process of
              deploying on Scroll. Here{"'"}s a sneak peek at some of the incredible minds you{"'"}ll be hearing from:
            </p>
            <ul>
              <li>Bunny (Dora)</li>
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

          {/* <div className="flex flex-row flex-wrap justify-center items-center p-4">
              <StageModalButton stages={stages} />
              <Button link={`/${params.organization}/${params.event}/schedule`}>Schedule</Button>
              <Button link={`/${params.organization}/${params.event}/speakers`}>Speakers</Button>
              <Button link={`/${params.organization}/${params.event}/archive`}>Archive</Button>
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default EventHome
