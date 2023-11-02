import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UPCOMING = [
  {
    name: 'ZuConnect Istanbul - Art Track',
    date: 'Today',
    link: '/zuzalu/zuconnect_istanbul__art_track',
  },
  {
    name: 'ZuConnect Istanbul - AI Track',
    date: 'Today',
    link: '/zuzalu/zuconnect_istanbul__ai_track',
  },
  {
    name: 'ZuConnect Desci Track',
    date: 'Tomorrow',
    link: 'zuconnect_desci_track',
  },
  {
    name: 'ZuConnect - Public Goods Track',
    date: 'Saturday',
    link: '/zuzalu/zuconnect__public_goods_track',
  },
]

const UpcomingEvents = () => {
  return (
    <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll ">
      {UPCOMING.map(({ name, date, link }, index) => (
        <Link href={link} key={index} className="cursor-pointer">
          <div className="h-full rounded-xl text-white uppercase">
            <div className="aspect-video relative">
              <Image
                className="rounded"
                alt="Session image"
                quality={80}
                src="/events/zuzalu-cover.png"
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="flex flex-col" title="Zuzalu">
              <p className=" text-md font-medium capitalize text-blue my-2 truncate">
                {name}
              </p>
              <p className="text-md text-blue text-sm font-medium">
                {date}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default UpcomingEvents
