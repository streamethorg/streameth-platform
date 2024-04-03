import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { IExtendedStage } from '@/lib/types'
import { DotFilledIcon } from '@radix-ui/react-icons'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import React from 'react'

const StreamHealth = ({
  stream,
  streamId,
  organization,
}: {
  stream: IExtendedStage
  streamId: string
  organization: string
}) => {
  return (
    stream?.streamSettings?.isActive && (
      <Card className="w-full shadow-none bg-white">
        <CardContent className="p-3 lg:p-6 flex justify-between items-center">
          <CardTitle className="text-xl flex gap-2 items-center">
            Stream Health:
            {stream?.streamSettings?.isHealthy ? (
              <div className="flex p-2 rounded-full items-center bg-success-foreground text-success">
                <DotFilledIcon className="w-10 h-10" /> Healthy
              </div>
            ) : (
              <div className="flex p-2 rounded-full items-center bg-destructive-secondary text-destructive">
                <DotFilledIcon className="w-10 h-10" /> UnHealthy
              </div>
            )}
          </CardTitle>
          <Link
            href={`/${organization}?streamId=${streamId}`}
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
