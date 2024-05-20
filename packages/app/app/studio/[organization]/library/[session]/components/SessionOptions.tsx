'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Code, Download, Share2 } from 'lucide-react'
import { EmbedModalContent } from '@/components/misc/interact/EmbedButton'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import VideoDownloadClient from '@/components/misc/VideoDownloadClient'

const DialogComponent = ({
  text,
  Icon,
  Modal,
}: {
  text: string
  Icon: JSX.Element
  Modal: JSX.Element
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <span
          className={buttonVariants({
            variant: 'secondary',
            className: 'space-x-2 border',
          })}>
          {Icon}
          <p className="hidden xl:flex">{text}</p>
        </span>
      </DialogTrigger>
      {Modal}
    </Dialog>
  )
}

const SessionOptions = ({
  name,
  playbackId,
  downloadUrl,
  organizationSlug,
  sessionId,
}: {
  name: string
  playbackId: string
  downloadUrl: string
  organizationSlug: string
  sessionId: string
}) => {
  return (
    <div className="flex justify-end items-center my-2 space-x-2">
      <DialogComponent
        text={'share'}
        Icon={<Share2 size={20} />}
        Modal={
          <ShareModalContent
            url={`${location.origin}/${organizationSlug}/watch?session=${sessionId}`}
            shareFor="video"
          />
        }
      />
      <DialogComponent
        text={'Embed'}
        Icon={<Code size={20} />}
        Modal={
          <EmbedModalContent
            playbackId={playbackId}
            playerName={name}
          />
        }
      />
      <VideoDownloadClient
        className="space-x-2 border"
        variant={'secondary'}
        videoName={name}
        playbackId={playbackId}
      />
    </div>
  )
}

export default SessionOptions
