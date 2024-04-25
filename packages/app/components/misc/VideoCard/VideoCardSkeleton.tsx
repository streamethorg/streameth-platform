'use client'

import { EllipsisVertical } from 'lucide-react'

const VideoCardSkeleton = () => {
  return (
    <div className="w-full min-h-full uppercase rounded-xl animate-pulse">
      <div className="bg-gray-300 aspect-video" />
      <div className="flex justify-between items-start mt-2">
        <div className="p-1 w-3/4 rounded lg:p-2">
          <div className="mb-2 h-4 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
        </div>

        <EllipsisVertical className="mt-2" />
      </div>
    </div>
  )
}

export const VideoCardSkeletonMobile = () => {
  return (
    <div className="flex items-center w-full min-h-full uppercase rounded-xl animate-pulse">
      <div className="w-1/4 bg-gray-300 aspect-video" />
      <div className="flex-grow ml-4">
        <div className="mb-2 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

export default VideoCardSkeleton
