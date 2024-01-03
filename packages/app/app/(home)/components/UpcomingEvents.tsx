import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IEvent } from 'streameth-server/model/event'
import { getImageUrl } from '@/lib/utils'
import { fetchEvents } from '@/lib/data'

const UpcomingEvents = async () => {
  const events = await fetchEvents({
    date: new Date(),
  })

  if (!events) return null

  return (
    <Card className="max-w-screen ">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          Check out the upcoming events on Streameth!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row overflow-x-scroll space-x-4">
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
            <Link key={index} href={`/${organizationId}/${id}`}>
              <Card
                className="p-2 w-96 h-full border-none"
                style={{
                  backgroundColor: accentColor,
                }}>
                <div className=" min-h-full rounded-xl text-white uppercase">
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
                  <CardHeader className="bg-background rounded mt-1">
                    <CardTitle className="truncate text-xl">
                      {name}
                    </CardTitle>
                    <CardDescription>
                      {start.toDateString()}
                      {new Date(start).toDateString() !==
                      new Date(end).toDateString()
                        ? ` - ${new Date(end).toDateString()}`
                        : ''}
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            </Link>
          )
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingEvents
