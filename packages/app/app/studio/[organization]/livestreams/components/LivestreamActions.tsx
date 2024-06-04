'use client'
import { IExtendedStage } from '@/lib/types'
import React from 'react'
import ShareLivestream from './ShareLivestream'
import DeleteLivestream from './DeleteLivestream'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScissorsLineDashed } from 'lucide-react'

const LivestreamActions = ({
  stream,
  organizationSlug,
}: {
  stream: IExtendedStage
  organizationSlug: string
}) => {
  return (
    <div className="space-y-2">
      <Link
        href={`/studio/${organizationSlug}/clips?stage=${stream._id}`}>
        <Button
          variant="ghost"
          className="flex gap-1 items-center w-full">
          <ScissorsLineDashed className="w-4 h-4" />
          Clip
        </Button>
      </Link>
      <ShareLivestream
        organization={organizationSlug}
        streamId={stream._id}
      />
      <DeleteLivestream stream={stream} />
    </div>
  )
}

export default LivestreamActions
