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
    <div className="max-w-4xl w-full mx-auto py-2">
      <div className="w-full flex flex-row justify-between items-center py-2">
        <CardTitle> Your organizations</CardTitle>
        <Link href={`/studio/${params.organization}/event/create`}>
          <Button className="w-full">Create Event</Button>
        </Link>
      </div>
      <div>
        {events?.map((event, index) => {
          return (
            <Link
              key={index}
              href={`/studio/${params.organization}/event?eventId=${event.slug}&settings=event`}>
              <Card className="flex overflow-hidden flex-row border border-secondary max-h-[300px] h-full">
                <CardHeader className=" relative p-0 lg:p-0 h-full w-[480px]">
                  <Image
                    className=""
                    alt="logo"
                    src={event.eventCover ?? ''}
                    width={250}
                    height={50}
                  />
                </CardHeader>
                <CardContent className="w-full p-2 space-y-2 h-full flex flex-col">
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>
                    {new Date(event.start).toDateString()} -{' '}
                    {new Date(event.end).toDateString()}
                  </CardDescription>
                  <p className=" overflow-hidden max-h-10 h-full flex">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col p-6 lg:p-6">
                  <p>{event.unlisted ? 'Unlisted' : 'Listed'}</p>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default OrganizationPage
