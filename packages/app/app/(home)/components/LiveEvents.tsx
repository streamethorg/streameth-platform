import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IEvent } from 'streameth-server/model/event'
import { getImageUrl } from '@/lib/utils'
import { Card } from '@/components/ui/card'
const LiveEvents = ({ events }: { events: IEvent[] }) => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll">
      {events.map(
        (
          {
            name,
            start,
            eventCover,
            organizationId,
            id,
            accentColor,
            end,
          },
          index
        ) => (
          <Card key={index}>
            <Link href={`/${organizationId}/${id}`}>
              <div className="bg-base min-h-full rounded-xl text-white uppercase">
                <div className="aspect-video relative">
                  <Image
                    className="rounded"
                    alt="Session image"
                    quality={80}
                    src={getImageUrl(`/events/${eventCover}`)}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div
                  className="flex  flex-col py-2 gap-2"
                  title="Zuzalu">
                  <p className="px-2 font-bold truncate">{name}</p>
                  <p className="px-2 text-md font-medium">
                    {start.toDateString()}
                    {new Date(start).toDateString() !==
                    new Date(end).toDateString()
                      ? ` - ${new Date(end).toDateString()}`
                      : ''}
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

export default LiveEvents
