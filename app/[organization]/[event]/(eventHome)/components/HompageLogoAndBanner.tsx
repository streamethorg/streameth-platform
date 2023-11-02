import React from 'react'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
import ReserveSpotButton from './ReserveSpotModal'
import ComponentWrapper from './ComponentWrapper'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getEventPeriod } from '@/utils/time'
const HomePageLogoAndBanner = ({ event }: { event: IEvent }) => {
  const { logo, banner } = event

  if (!logo && !banner) return null

  return (
    <ComponentWrapper sectionId="home">
      <Image
        className="rounded-lg"
        src={'/events/' + banner}
        alt="Event Cover"
        width={1500}
        height={500}
      />
      <div id="home" className="flex flex-col p-4">
        <div className=" flex-col flex space-y-2 md:flex-col">
          <h1 className="text-4xl text-left font-bold">
            {event.name}
          </h1>
          <div className=" flex flex-col space-y-4 text-left">
            <p>
              <span className="mr-2">&#128197;</span>
              {new Date(event.start).toDateString()}
            </p>
            <p>
              <span className="mr-2">&#9200;</span>
              {event?.startTime
                ? `${getEventPeriod(event.startTime)} ${
                    event.timezone
                  }`
                : 'TBD'}
            </p>
            <p>
              <span className="mr-2">&#127759;</span>
              {event.location}
            </p>
            {/* <ReserveSpotButton event={event} /> */}
            <article className="prose max-w-full prose-gray text-white">
              <Markdown remarkPlugins={[remarkGfm]}>
                {event.description}
              </Markdown>
            </article>
          </div>
        </div>
      </div>
    </ComponentWrapper>
  )
}

export default HomePageLogoAndBanner
