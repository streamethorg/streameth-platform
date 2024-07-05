'use client'

import { EllipsisVertical } from 'lucide-react'

const VideoCardSkeleton = () => {
  return (
    <div className="min-h-full w-full animate-pulse rounded-xl uppercase">
      <div className="aspect-video bg-gray-300" />
      <div className="mt-2 flex items-start justify-between">
        <div className="w-3/4 rounded p-1 lg:p-2">
          <div className="mb-2 h-4 rounded bg-gray-300"></div>
          <div className="h-3 w-1/2 rounded bg-gray-300"></div>
        </div>

        <EllipsisVertical className="mt-2" />
      </div>
    </div>
  )
}

export const VideoCardSkeletonMobile = () => {
  return (
    <div className="flex min-h-full w-full animate-pulse items-center rounded-xl uppercase">
      <div className="aspect-video w-1/4 bg-gray-300" />
      <div className="ml-4 flex-grow">
        <div className="mb-2 h-4 rounded bg-gray-300"></div>
        <div className="h-3 w-1/2 rounded bg-gray-300"></div>
      </div>
    </div>
  )
}

export default VideoCardSkeleton
