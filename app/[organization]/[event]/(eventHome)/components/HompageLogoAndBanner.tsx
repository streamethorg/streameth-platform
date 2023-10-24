import React from 'react'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
const HomePageLogoAndBanner = ({ event }: { event: IEvent }) => {
  const { logo, banner } = event

  return (
    <div className="relative w-full">
      <Image src={'/events/' + banner} alt="Event Cover" width={1500} height={500} />
    </div>
  )
}

export default HomePageLogoAndBanner
