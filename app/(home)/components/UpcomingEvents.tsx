import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UPCOMING = [
  {
    name: 'ZuConnect Desci Track',
    date: 'Today',
    link: '/zuzalu/zuconnect_desci_track',
  },
  {
    name: 'ZuConnect - Public Goods Track',
    date: 'Tomorrow',
    link: '/zuzalu/zuconnect__public_goods_track',
  },
  {
    name: 'ZuConnect - ZK Track',
    date: 'Monday',
    link: '/zuzalu/zuconnect__zk_track',
  },
  {
    name: 'ZuConnect - Decentralized Social Track',
    date: 'Tuesday',
    link: '/zuzalu/zuconnect__decentralized_social_track',
  },
]

const UpcomingEvents = () => {
  return (
    <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll ">
      {UPCOMING.map(({ name, date, link }, index) => (
        <Link
          href={link}
          key={index}
          className="cursor-pointer px-2 hover:shadow-md rounded-xl">
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
            <div className="flex flex-col my-2 gap-2" title="Zuzalu">
              <p className=" text-sm font-bold capitalize text-blue  truncate">
                {name}
              </p>
              <p className="text-blue text-sm font-medium">{date}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default UpcomingEvents
