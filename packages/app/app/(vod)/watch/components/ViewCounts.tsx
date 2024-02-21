import { getSessionMetrics } from '@/lib/actions/sessions'

const ViewCounts = async ({ playbackId }: { playbackId: string }) => {
  const data = await getSessionMetrics({ playbackId })

  return (
    <p className="text-sm text-secodary py-2">
      {data.viewCount} views
    </p>
  )
}

export default ViewCounts
