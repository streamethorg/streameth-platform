import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
} from '@/components/ui/card'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization, fetchEvents } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'

const OrganizationPage = async ({ params }: studioPageParams) => {
  console.log('organization', params.organization)
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{organization?.name}</CardTitle>
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
    </Card>
  )
}

export default OrganizationPage
