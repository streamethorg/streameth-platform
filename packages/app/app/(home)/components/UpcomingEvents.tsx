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
import { apiUrl, getImageUrl } from '@/lib/utils/utils'
import { IOrganization } from 'streameth-server/model/organization'
import { IEvent } from 'streameth-server/model/event'

const UpcomingEvents = async ({
  date,
  organization,
  archive,
}: {
  date?: Date
  organization?: IOrganization['_id']
  archive?: boolean
}) => {
  const allOrgs = await fetch(`${apiUrl()}/organizations`)
  const allOrgsData = await allOrgs.json()
  const orgId = allOrgsData.data.find(
    (org: IOrganization) => org.slug === organization
  )?._id

  const response = await fetch(
    `${apiUrl()}/events/organization/${orgId}`
  )

  const data = await response.json()
  const events: IEvent[] = data.data ?? []

  if (events.length === 0) return null

  return (
    <Card className="max-w-screen border-none bg-white">
      <CardHeader>
        <CardTitle className="text-background ">Events</CardTitle>
        <CardDescription>
          Explore current and past events
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row overflow-x-scroll space-x-4 ">
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
            <Link
              key={index}
              href={
                archive
                  ? `/archive?event=` + id
                  : `/${organizationId}/${id}`
              }>
              <Card
                className="p-2 w-72 h-full border-none"
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
                    <CardTitle className="truncate text-sm">
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
