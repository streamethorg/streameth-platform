'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { fetchStage } from '@/lib/services/stageService'
import { IExtendedStage } from '@/lib/types'
import { DotFilledIcon } from '@radix-ui/react-icons'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import React, { useEffect, useState } from 'react'

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

    const interval = setInterval(() => {
      checkIsHealthy()
    }, 10000)
  }, [stream?.streamSettings?.isHealthy, isLive])

  return (
    isLive && (
      <>
        {isHealthy ? (
          <div className="flex items-center p-2 text-sm rounded-full bg-success-foreground text-success">
            <DotFilledIcon className="w-4 h-4" /> Healthy
          </div>
        ) : (
          <div className="flex items-center p-2 text-sm rounded-full bg-destructive-secondary text-destructive">
            <DotFilledIcon className="w-4 h-4" /> UnHealthy
          </div>
        )}
      </>
    )
  )
}
export default StreamHealth
