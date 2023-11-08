import Card from '@/components/misc/Card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UPCOMING = [
  {
    name: 'ZuConnect - Decentralized Social Track',
    date: 'Today',
    link: '/zuzalu/zuconnect__decentralized_social_track',
    image: '/events/zuzalu-cover.png',
  },
  {
    name: 'ETHGünü',
    date: 'Monday, 13 Nov',
    link: '/devconnect/ethgunu',
    image: '/events/ETHGunu_cover.jpeg',
  },
  {
    name: 'EVM Summit',
    date: 'Tuesday, 14 Nov',
    link: '/devconnect/evm_summit',
    image: '/events/EVM_summit_cover.jpeg',
  },
  {
    name: 'ETHconomics',
    date: 'Wednesday, 15 Nov',
    link: '/devconnect/ethconomics',
    image: '/events/ethconomics_cover.jpeg',
  },
]

const UpcomingEvents = () => {
  return (
    <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll">
      {UPCOMING.map(({ name, date, link, image }, index) => (
        <Card key={index}>
          <Link href={link}>
            <div className="h-full rounded-xl text-white uppercase">
              <div className="aspect-video relative">
                <Image
                  className="rounded"
                  alt="Session image"
                  quality={80}
                  src={`${image}`}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div
                className="flex flex-col my-2 gap-2"
                title="Zuzalu">
                <p className=" text-sm font-bold capitalize text-blue  truncate">
                  {name}
                </p>
                <p className="text-blue text-sm font-medium">
                  {date}
                </p>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
}

export default UpcomingEvents
