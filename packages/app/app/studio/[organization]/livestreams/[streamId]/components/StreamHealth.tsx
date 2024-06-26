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
        <CardContent className="flex justify-between items-center p-3 lg:p-6">
          <CardTitle className="flex gap-2 items-center text-xl">
            Stream Health:
            {isHealthy ? (
              <div className="flex items-center p-2 py-1 pl-3 text-sm rounded-full bg-success-foreground text-success">
                <span className="flex relative mr-2 w-2 h-2">
                  <span className="inline-flex absolute w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="inline-flex relative w-2 h-2 bg-green-600 rounded-full"></span>
                </span>
                Healthy
              </div>
            ) : (
              <div className="flex items-center p-2 py-1 pl-3 text-sm rounded-full bg-success-foreground text-success">
                <span className="flex relative mr-2 w-2 h-2">
                  <span className="inline-flex absolute w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="inline-flex relative w-2 h-2 bg-red-600 rounded-full"></span>
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
                <ArrowRight className="pl-1 w-4 h-4" />
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  )
}
export default StreamHealth
