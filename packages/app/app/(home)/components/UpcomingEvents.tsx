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
import { Button } from '@/components/ui/button'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
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
    <div className="max-w-screen border-none">
      <CardHeader className="px-0 lg:px-0">
        <CardTitle className=" ">Events</CardTitle>
        <CardDescription>
          Explore current and past events
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 lg:px-0 flex flex-row overflow-x-scroll space-x-4 ">
        {events.map(
          ({ name, eventCover, accentColor, slug }, index) => (
            <div key={index}>
              <Card
                className="p-2 w-[350px] h-full border-none text-foreground"
                style={{
                  backgroundColor: accentColor,
                }}>
                <div className=" min-h-full rounded-xl  uppercase">
                  <div className=" relative">
                    <Thumbnail imageUrl={eventCover} />
                  </div>
                  <CardHeader className=" px-2 lg:px-2 lg:py-2  rounded mt-1 bg-white bg-opacity-10 space-y-4">
                    <CardTitle className="truncate text-body text-white text-xl">
                      {name}
                    </CardTitle>
                    <CardDescription className="text-white flex flex-row space-x-2 ">
                      <Link href={archivePath({ event: slug })}>
                        <Button variant="outline" className="w-full">
                          Archive
                        </Button>
                      </Link>
                      <Link href={`/${organization}/${slug}`}>
                        <Button
                          variant="secondary"
                          className="w-full">
                          Event page
                        </Button>
                      </Link>
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            </div>
          )
        )}
      </CardContent>
    </div>
  )
}

export default UpcomingEvents
