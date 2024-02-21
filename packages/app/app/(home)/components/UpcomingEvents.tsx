import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { fetchEvents } from '@/lib/services/eventService'
import { archivePath } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { getDateAsString } from '@/lib/utils/time'
import { IExtendedOrganization } from '@/lib/types'

const UpcomingEvents = async ({
  organizations,
  date,
  organization,
  archive,
}: {
  date?: Date
  archive?: boolean
  organizations?: IExtendedOrganization[]
  organization?: IExtendedOrganization['_id']
}) => {
  const events = (
    await fetchEvents({
      organizationSlug: organization,
    })
  ).filter((event) => {
    if (date) {
      return new Date(event.start) > date
    }
    return true
  })

  const organizationSlug = (organizationId: string) => {
    const orgSlug = organizations?.find(
      (org) => org._id === organizationId
    )?.slug
    return orgSlug ? orgSlug : organization
  }

  if (events.length === 0) return null

  return (
    <div className="max-w-screen border-none">
      <CardHeader className="px-0 lg:px-0">
        <CardTitle className=" ">Events</CardTitle>
        <CardDescription>
          Explore current and past events
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full px-0 lg:px-0 flex flex-row overflow-auto space-x-4 ">
        {events.map(
          (
            {
              name,
              eventCover,
              accentColor,
              slug,
              organizationId,
              start,
            },
            index
          ) => (
            <Card
              key={index}
              className="p-2 w-full lg:w-[350px] h-full border-none text-foreground"
              style={{
                backgroundColor: accentColor,
              }}>
              <Link
                href={`/${organizationSlug(
                  organizationId as string
                )}/${slug}`}
                className="w-full h-full">
                <div className=" min-h-full rounded-xl  uppercase">
                  <div className=" relative">
                    <Thumbnail imageUrl={eventCover} />
                  </div>
                  <CardHeader className=" px-2 lg:px-2 lg:py-2  rounded mt-1 bg-white bg-opacity-10">
                    <CardTitle className="truncate text-body text-white text-xl">
                      {name}
                    </CardTitle>
                    <CardDescription className="text-white flex flex-col">
                      {new Date(start).toDateString()}
                      <Button variant="outline" className="w-full">
                        Event page
                      </Button>
                    </CardDescription>
                  </CardHeader>
                </div>
              </Link>
            </Card>
          )
        )}
      </CardContent>
    </div>
  )
}

export default UpcomingEvents
