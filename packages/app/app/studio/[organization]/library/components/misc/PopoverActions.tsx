'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Copy, FilePenLine, Share2, Trash2 } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import DeleteAsset from '../DeleteAsset'
import { IExtendedSession, eLayout } from '@/lib/types'
import Link from 'next/link'
import { toast } from 'sonner'
import VideoDownloadClient from '@/components/misc/VideoDownloadClient'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'

export const PopoverActions = ({
  session,
  organizationSlug,
  layout,
}: {
  session: IExtendedSession
  organizationSlug: string
  layout: eLayout
}): ReactNode => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(
        `${
          location.origin
        }/${organizationSlug}/watch?session=${session._id.toString()}`
      )
    }
  }, [organizationSlug, session])

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
          <Button variant={'outline'} className="space-x-2 w-full">
            <FilePenLine />
            <p className="">Edit</p>
          </Button>
        </Link>
        {layout === eLayout.grid && (
          <Button
            variant={'outline'}
            className="space-x-2"
            onClick={() => handleCopy()}>
            <Copy />
            <p>Copy IPFS Hash</p>
          </Button>
        )}
        <Dialog>
          <DialogTrigger>
            <span
              className={buttonVariants({
                variant: 'outline',
                className: 'space-x-2 w-full',
              })}>
              <Share2 />
              <p className="">Share</p>
            </span>
          </DialogTrigger>
          <ShareModalContent url={url} shareFor="video" />
        </Dialog>
        {session.playbackId && (
          <VideoDownloadClient
            className="space-x-2"
            videoName={`${session.name}.mp4`}
            variant="outline"
            playbackId={session.playbackId}
          />
        )}
        <DeleteAsset
          session={session}
          href={`/studio/${organizationSlug}/library`}
          TriggerComponent={
            <span
              className={buttonVariants({
                variant: 'destructive-outline',
                className:
                  'flex justify-center space-x-2 cursor-pointer hover:bg-gray-100',
              })}>
              <Trash2 />
              <p>Delete</p>
            </span>
          }
        />
      </div>
    </div>
  )
}
