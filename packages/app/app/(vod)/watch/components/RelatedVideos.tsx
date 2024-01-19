import { fetchAllSessions } from '@/lib/data'
import VideoCard from '@/components/misc/VideoCard'
import { ISession } from 'streameth-server/model/session'
import { apiUrl } from '@/lib/utils/utils'
export default async function RelatedVideos({
  event,
}: {
  event: string
}) {
  const response = await fetch(
    `${apiUrl()}/sessions?event=${event}&onlyVideos=true&page=1&size=5`
  )
  const data = await response.json()
  const videos: ISession[] = data.data?.sessions ?? []
  return (
    <div className="max-w-screen bg-transparent border-none ">
      <div className="grid grid-cols-1 gap-4">
        {videos.map((session, index) => (
          <VideoCard session={session} key={index} invertedColors />
        ))}
      </div>
    </div>
  )
}
