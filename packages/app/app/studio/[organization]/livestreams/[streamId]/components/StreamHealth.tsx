'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { fetchStage } from '@/lib/services/stageService'
import { IExtendedStage } from '@/lib/types'
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
      <Card className="w-full bg-white shadow-none">
        <CardContent className="flex items-center justify-between p-3 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            Stream Health:
            {isHealthy ? (
              <div className="flex items-center rounded-full bg-success-foreground p-2 py-1 pl-3 text-sm text-success">
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600"></span>
                </span>
                Healthy
              </div>
            ) : (
              <div className="flex items-center rounded-full bg-success-foreground p-2 py-1 pl-3 text-sm text-success">
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                </span>
                Unhealthy
              </div>
            )}
          </CardTitle>
          <Link
            href={`/${organization}/livestream?stage=${streamId}`}
            target="_blank">
            <Button variant="outline">
              View Livestream
              <div>
                <ArrowRight className="h-4 w-4 pl-1" />
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  )
}
export default StreamHealth
