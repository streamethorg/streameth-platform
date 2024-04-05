'use client'

import { Button } from '@/components/ui/button'
import { Code, Download, Share2 } from 'lucide-react'
import { EmbedModalContent } from '@/components/misc/interact/EmbedButton'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

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
        <Button variant={'secondary'} className="space-x-2 border-2">
          {Icon}
          <p className="hidden xl:flex">{text}</p>
        </Button>
      </DialogTrigger>
      {Modal}
    </Dialog>
  )
}

const SessionOptions = ({
  name,
  playbackId,
  downloadUrl,
}: {
  name: string
  playbackId: string
  downloadUrl: string
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(downloadUrl)
      if (!response.ok)
        throw new Error('Network response was not ok.')

      const data = await response.blob()
      const blobUrl = window.URL.createObjectURL(data)
      const link = document.createElement('a')

      link.href = blobUrl
      link.setAttribute('download', name)
      document.body.appendChild(link)

      link.click()
      link.parentNode!.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      toast.success('Succesfully downloaded the video')
    } catch (err) {
      toast.error('Failed to download the video')
    }
  }

  return (
    <div className="flex justify-end items-center my-2 space-x-2">
      <DialogComponent
        text={'share'}
        Icon={<Share2 size={20} />}
        Modal={<ShareModalContent />}
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
      <Button
        onClick={handleDownload}
        variant={'secondary'}
        className="space-x-2 border border-gray-300">
        <Download size={19} />
        <p className="hidden xl:flex">Download</p>
      </Button>
    </div>
  )
}

export default SessionOptions
