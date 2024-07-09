'use client'

import { fetchStage } from '@/lib/services/stageService'
import { IExtendedStage } from '@/lib/types'
import { useEffect, useState } from 'react'

const StreamHealth = ({
  stream,
  streamId,
  organization,
  isLive,
}: {
  stream: IExtendedStage
  streamId: string
  organization: string
  isLive?: boolean
}) => {
  const [isHealthy, setIsHealthy] = useState(
    stream?.streamSettings?.isHealthy
  )

  const checkIsHealthy = async () => {
    try {
      const res = await fetchStage({ stage: stream._id as string })
      setIsHealthy(res?.streamSettings?.isHealthy)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLive) {
      return
    }

    setInterval(() => {
      checkIsHealthy()
    }, 10000)
  }, [stream?.streamSettings?.isHealthy, isLive])

  return (
    isLive && (
      <>
        {isHealthy ? (
          <div className="flex items-center rounded-full bg-red-400 p-2 py-1 pl-3 text-sm">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600"></span>
            </span>
            Healthy
          </div>
        ) : (
          <div className="text-s flex items-center rounded-full bg-red-300 p-2 py-1 pl-3 text-sm text-black">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
            </span>
            Unhealthy
          </div>
        )}
      </>
    )
  )
}
export default StreamHealth
