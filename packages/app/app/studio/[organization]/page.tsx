'use server'

import { studioPageParams } from '@/lib/types'
import { fetchEvents } from '@/lib/services/eventService'
import EventList from './components/EventTable'
import LibraryTable from './components/LibraryTable'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const OrganizationPage = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  const settings = searchParams?.settings

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-full h-full">
        {{
          events: (
            <EventList
              organization={params.organization}
              events={events}
            />
          ),
          videos: <LibraryTable organization={params.organization} />,
          settings: <>Nothing here yet</>,
        }[settings] || (
          <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 max-w-5xl">
            <Card className="text-white bg-gradient-to-br from-[#3D22BA] to-[#6426EF] w-full h-full col-span-2 ">
              <CardHeader>
                <CardTitle>Create Events</CardTitle>
                <CardDescription className="text-white max-w-[300px]">
                  Connect with the rest of the Web3 community when you
                  create an event on StreamETH.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="text-black bg-white">
                  Create an Event {'>'}
                </Button>
              </CardFooter>
            </Card>
            <Card className="text-white min-h-full w-full m-auto border-secondary col-span-1 bg-gradient-to-b from-[#1E293B] to-[#000000] ">
              <CardHeader>
                <CardTitle>Upload video</CardTitle>
                <CardDescription className="text-white">
                  Upload and manage video content on your
                  organization’s page{' '}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="primary">Upload video</Button>
              </CardFooter>
            </Card>
            <Card className="text-white min-h-full w-full m-auto border-secondary col-span-1 bg-gradient-to-b from-[#1E293B] to-[#000000] ">
              <CardHeader>
                <CardTitle>Upload video</CardTitle>
                <CardDescription className="text-white">
                  Upload and manage video content on your
                  organization’s page{' '}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="primary">Upload video</Button>
              </CardFooter>
            </Card>
            <Card className="text-white bg-gradient-to-br from-[#3D22BA] to-[#6426EF] w-full h-full col-span-2 ">
              <CardHeader>
                <CardTitle>Start a livestream</CardTitle>
                <CardDescription className="text-white max-w-[300px]">
                  Stream your event without restrictions to millions
                  of views globally.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="text-black bg-white">
                  Start a livestream
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationPage
