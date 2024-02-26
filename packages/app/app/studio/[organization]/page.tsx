import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { studioPageParams } from '@/lib/types'
import { fetchEvents } from '@/lib/services/eventService'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const OrganizationPage = async ({ params }: studioPageParams) => {
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  return (
    <div className="max-w-4xl h-full w-full mx-auto p-4">
      <div className="w-full flex flex-row justify-between items-center pb-2">
        <CardTitle> Your events</CardTitle>
        <Link href={`/studio/${params.organization}/event/create`}>
          <Button className="w-full">Create Event</Button>
        </Link>
      </div>
      <div className="flex flex-col space-y-2 h-[calc(100%-60px)] overflow-auto">
        {events?.map((event, index) => {
          return (
            <Link
              key={index}
              href={`/studio/${params.organization}/event?eventId=${event.slug}&settings=event`}>
              <Card className="rounded-xl flex overflow-hidden flex-row border border-secondary shadow-none max-h-[300px] h-full">
                <CardHeader className=" relative p-2 lg:p-2 h-full w-[280px]">
                  <Image
                    className="rounded-xl"
                    alt="logo"
                    src={event.eventCover ?? ''}
                    width={280}
                    height={50}
                  />
                </CardHeader>
                <CardContent className="w-full space-y-2 h-full flex flex-col p-3 lg:p-3  justify-center">
                  <p className="text-xl">{event.name}</p>
                  <CardDescription>
                    {new Date(event.start).toDateString()} -{' '}
                    {new Date(event.end).toDateString()}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col p-6 lg:p-6">
                  <p>{event.unlisted ? 'Unlisted' : 'Listed'}</p>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
        {events.length === 0 && (
          <div className="flex flex-row justify-center items-center w-full h-full">
            <p>No events yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationPage
