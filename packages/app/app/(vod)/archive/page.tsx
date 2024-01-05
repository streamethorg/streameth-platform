import { fetchAllSessions } from '@/lib/data'
import Videos from '@/components/misc/Videos'
import { SearchPageProps } from '@/lib/types'
import UpcomingEvents from '@/app/(home)/components/UpcomingEvents'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// TODO: pagination
export default async function ArchivePage({
  searchParams,
}: SearchPageProps) {
  const videos = await fetchAllSessions({
    organization: searchParams.organization,
    event: searchParams.event,
    limit: 12,
    onlyVideos: true,
    searchQuery: searchParams.searchQuery,
  })

  return (
    <div className="bg-white">
      <UpcomingEvents
        organization={
          searchParams.organization
            ? searchParams.organization
            : 'invalid'
        }
      />
      <Card className="bg-white border-none">
        <CardHeader>
          <CardTitle className="text-background">Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Videos videos={videos.sessions} />
        </CardContent>
      </Card>
    </div>
  )
}

// TODO
// export async function generateMetadata(
//   { params }: Params,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const eventController = new EventController()
//   const event = await eventController.getEvent(
//     params.event,
//     params.organization
//   )
//   const imageUrl = event.eventCover
//     ? event.eventCover
//     : event.id + '.png'

//   return {
//     title: `${event.name} - Archive`,
//     description: `Watch all the Streameth videos from ${event.name} here`,
//     openGraph: {
//       images: [imageUrl],
//     },
//   }
// }
