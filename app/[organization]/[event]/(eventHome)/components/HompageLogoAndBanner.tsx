import React from 'react'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
const HomePageLogoAndBanner = ({ event }: { event: IEvent }) => {
  const { logo, banner } = event

  if (!logo && !banner) return null

  return (
    <div className="relative w-full z-[1]">
      <Image src={'/events/' + banner} alt="Event Cover" width={1500} height={500} />
    </div>
  )
}

export default HomePageLogoAndBanner
