import React from 'react'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
import ReserveSpotButton from './ReserveSpotModal'
import ComponentWrapper from './ComponentWrapper'
const HomePageLogoAndBanner = ({ event }: { event: IEvent }) => {
  const { logo, banner } = event

  if (!logo && !banner) return null

  return (
    <ComponentWrapper>
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
              <span className="mr-2">&#128197;</span>When:{' '}
              {new Date(event.start).toDateString()}
            </p>
            <p>
              <span className="mr-2">&#9200;</span> Time:{' '}
              {new Date(event.start).toLocaleTimeString()}
            </p>
            <p>
              <span className="mr-2">&#127759;</span> Where:{' '}
              {event.location}
            </p>
            <ReserveSpotButton event={event} />
            <p>{event.description}</p>
          </div>
        </div>
      </div>
    </ComponentWrapper>
  )
}

export default HomePageLogoAndBanner
