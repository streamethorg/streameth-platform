'use client'
import { useAssetMetrics } from '@livepeer/react'

const ViewCounts = ({ assetId }: { assetId: string }) => {
  const { data, isLoading } = useAssetMetrics({ assetId })
  if (isLoading) return null
  const viewMetrics = data?.metrics[0].startViews

  return (
    <p className="text-sm text-secodary py-2">{viewMetrics} views</p>
  )
}

export default ViewCounts
