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
      <Card className="w-full shadow-none bg-white">
        <CardContent className="p-3 lg:p-6 flex justify-between items-center">
          <CardTitle className="text-xl flex gap-2 items-center">
            Stream Health:
            {isHealthy ? (
              <div className="flex p-2 rounded-full items-center text-sm bg-success-foreground text-success">
                <DotFilledIcon className="w-7 h-7" /> Healthy
              </div>
            ) : (
              <div className="flex p-2 rounded-full items-center text-sm bg-destructive-secondary text-destructive">
                <DotFilledIcon className="w-7 h-7" /> UnHealthy
              </div>
            )}
          </CardTitle>
          <Link
            href={`/${organization}?playbackId=${streamId}`}
            target="_blank">
            <Button variant="outline">
              View Livestream
              <div>
                <ArrowRight className="w-4 h-4 pl-1" />
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  )
}
export default StreamHealth
