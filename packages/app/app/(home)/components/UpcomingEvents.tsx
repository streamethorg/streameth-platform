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

import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface'

import { fetchEvents } from '@/lib/data'
import { archivePath } from '@/lib/utils/path'

const UpcomingEvents = async ({
  date,
  organization,
  archive,
}: {
  date?: Date
  organization?: IOrganizationModel['_id']
  archive?: boolean
}) => {
  const events = await fetchEvents({
    date,
    organizationSlug: organization,
  })

  if (events.length === 0) return null

  return (
    <Card className="bg-white border-none max-w-screen">
      <CardHeader>
        <CardTitle className="text-background">Events</CardTitle>
        <CardDescription>
          Explore current and past events
        </CardDescription>
      </CardHeader>
      <CardContent className="flex overflow-x-scroll flex-row space-x-4">
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
              slug,
            },
            index
          ) => (
            <Link
              key={index}
              href={
                archive
                  ? archivePath({ event: slug })
                  : `/${organizationId}/${id}`
              }>
              <Card
                className="p-2 w-72 h-full border-none"
                style={{
                  backgroundColor: accentColor,
                }}>
                <div className="min-h-full text-white uppercase rounded-xl">
                  <div className="relative aspect-video">
                    <Image
                      className="rounded"
                      alt="Session image"
                      quality={80}
                      src={`${eventCover}`}
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <CardHeader className="mt-1 rounded bg-background">
                    <CardTitle className="text-sm truncate">
                      {name}
                    </CardTitle>
                    <CardDescription>
                      {new Date(start).toDateString()}
                      {/* {new Date(start).toDateString() !==
                      new Date(end).toDateString()
                        ? ` - ${new Date(end).toDateString()}`
                        : ''} */}
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
