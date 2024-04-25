import { getSessionMetrics } from '@/lib/actions/sessions'

const ViewCounts = async ({
  playbackId,
  className,
}: {
  playbackId: string
  className?: string
}) => {
  const data = await getSessionMetrics({ playbackId })

  return (
    <p className={className ?? 'text-sm text-secodary py-2'}>
      {data.viewCount} views
    </p>
  )
}

export default ViewCounts
