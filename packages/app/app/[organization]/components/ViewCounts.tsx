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
    <p className={className ?? 'text-sm text-secodary py-2'}>
      {data.viewCount} views
    </p>
  )
}

export default ViewCounts
