import React from 'react'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
const HomePageLogoAndBanner = ({ event }: { event: IEvent }) => {
  const { logo, banner } = event

  return (
    <div className="relative w-full">
      <div className="relative">
        <Image
          src={'/events/' + banner}
          alt="Event Cover"
          width={1500}
          height={500}
          className="w-full object-cover h-36 md:h-52 lg:h-96"
        />
        <Image
          src={'/events/' + logo}
          alt="Event Logo"
          width={128}
          height={128}
          className="absolute bottom-0 translate-y-1/2 translate-x-3 lg:translate-x-1/2 w-24 h-24 lg:w-32 lg:h-32 object-cover p-2 border-2 border-accent bg-white"
        />
      </div>
    </div>
  )
}

export default HomePageLogoAndBanner
