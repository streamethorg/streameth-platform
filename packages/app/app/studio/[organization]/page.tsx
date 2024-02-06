import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
} from '@/components/ui/card'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import { fetchEvents } from '@/lib/services/eventService'
import Image from 'next/image'
import Link from 'next/link'

const OrganizationPage = async ({ params }: studioPageParams) => {
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  return (
    <div className="border-none">
      <CardHeader>
        <CardTitle>Your events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {events?.map((event, index) => {
            return (
              <Link
                key={index}
                href={`/studio/${params.organization}/event?eventId=${event.slug}`}>
                <Card
                  className="p-2 w-72 h-full "
                  style={{
                    backgroundColor: event.accentColor,
                  }}>
                  <div className=" min-h-full rounded-xl  uppercase">
                    <div className="aspect-video relative">
                      <Image
                        className="rounded"
                        alt="Session image"
                        quality={80}
                        src={`${event.eventCover}`}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <CardHeader className=" rounded mt-1">
                      <CardTitle className="truncate text-sm">
                        {event.name}
                      </CardTitle>
                    </CardHeader>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </div>
  )
}

export default OrganizationPage
