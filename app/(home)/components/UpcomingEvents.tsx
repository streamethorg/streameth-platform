import Card from '@/components/misc/Card'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UpcomingEvents = ({ events }: { events: IEvent[] }) => {
  return (
    <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll">
      {events.map(
        (
          {
            name,
            start,
            eventCover,
            organizationId,
            id,
            accentColor,
          },
          index
        ) => (
          <Card key={index} bgColor={accentColor}>
            <Link href={`/${organizationId}/${id}`}>
              <div className="h-full rounded-xl text-white uppercase">
                <div className="aspect-video relative">
                  <Image
                    className="rounded"
                    alt="Session image"
                    quality={80}
                    src={`/events/${eventCover}`}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div
                  className="flex flex-col my-2 gap-2"
                  title="Zuzalu">
                  <p className=" text-sm font-bold capitalize  truncate">
                    {name}
                  </p>
                  <p className=" text-sm font-medium">
                    {new Date(start).toDateString()}
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        )
      )}
    </div>
  )
}

export default UpcomingEvents
