import { fetchAllSessions } from '@/lib/data'
import VideoCard from '@/components/misc/VideoCard'
export default async function RelatedVideos({
  searchQuery,
}: {
  searchQuery: string
}) {
  const videos = (
    await fetchAllSessions({
      searchQuery: searchQuery.slice(0, 4),
      onlyVideos: true,
      limit: 5,
    })
  ).sessions

  return (
    <div className="max-w-screen bg-transparent border-none">
      <div className="grid grid-cols-1 gap-4">
        {videos.map((session, index) => (
          <VideoCard session={session} key={index} invertedColors />
        ))}
      </div>
    </div>
  )
}
