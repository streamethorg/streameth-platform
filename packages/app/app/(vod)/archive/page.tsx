import { fetchAllSessions } from '@/lib/data'
import Videos from '@/components/misc/Videos'

interface Params {
  searchParams: {
    organization?: string
    event?: string
    speaker?: string
    session?: string
  }
}

export default async function ArchivePage({ searchParams }: Params) {
  const videos = await fetchAllSessions({
    organization: searchParams.organization,
    event: searchParams.event,
    // speakerIds: [searchParams.speaker],
    // session: searchParams.session,
    onlyVideos: true,
    limit: 10,
  })

  return (
    <div className="bg-white">
      <Videos videos={videos.sessions} />
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
