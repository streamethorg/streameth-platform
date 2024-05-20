'use client'

import { ReactNode, forwardRef } from 'react'
import {
  Copy,
  Download,
  FilePenLine,
  Share2,
  Trash2,
  TrashIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeleteAsset from '../DeleteAsset'
import { IExtendedSession } from '@/lib/types'
import Link from 'next/link'
import { toast } from 'sonner'
import VideoDownloadClient from '@/components/misc/VideoDownloadClient'

// const TriggerComponent = forwardRef<HTMLDivElement, {}>(
//   (props, ref) => (
//     <div ref={ref} className="flex justify-start">
//       <Button variant={'ghost'} className="space-x-2">
//         <TrashIcon className="text-red-500" />
//         <p>Delete</p>
//       </Button>
//     </div>
//   )
// )

export const DropdownItems = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession
  organizationSlug: string
}): ReactNode => {
  const handleCopy = () => {
    navigator.clipboard.writeText(session.ipfsURI as string)
    toast.success('Copied IPFS Hash to your clipboard')
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Link
          href={`/studio/${organizationSlug}/library/${
            session._id as string
          }`}>
          <Button
            variant={'ghost'}
            className="space-x-2 w-full text-muted-foreground">
            <FilePenLine />
            <p className="">Edit</p>
          </Button>
        </Link>
        <Button
          variant={'ghost'}
          className="space-x-2 text-muted-foreground"
          onClick={() => handleCopy()}>
          <Copy />
          <p>Copy IPFS Hash</p>
        </Button>
        {session.playbackId && (
          <VideoDownloadClient
            className="space-x-2 text-muted-foreground"
            videoName={`${session.name}.mp4`}
            variant="ghost"
            playbackId={session.playbackId}
          />
        )}
        <DeleteAsset
          session={session}
          href={`/studio/${organizationSlug}/library`}
          TriggerComponent={
            <Button
              variant={'destructive-outline'}
              className="flex justify-center space-x-2">
              <Trash2 />
              <p>Delete</p>
            </Button>
          }
        />
      </div>
    </div>
  )
}
