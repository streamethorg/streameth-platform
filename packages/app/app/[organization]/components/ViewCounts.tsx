import { fetchSessionMetrics } from '@/lib/services/sessionService'

const ViewCounts = async ({
  playbackId,
  className,
}: {
  playbackId: string
  className?: string
}) => {
  const data = await fetchSessionMetrics({ playbackId })

  return (
    <p className={className ?? 'text-secodary py-2 text-sm'}>
      {data.viewCount} views
    </p>
  )
}

export default ViewCounts
