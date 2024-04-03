'use client'
import { useEffect, useState } from 'react'
import Player from '@/components/ui/Player'
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import ShareButton from '@/components/misc/interact/ShareButton'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { deleteSessionAction } from '@/lib/actions/sessions'
import { Button } from '@/components/ui/button'

const Preview = ({
  initialIsOpen,
  playbackId,
  organizationId,
}: {
  initialIsOpen: boolean
  playbackId: string
  organizationId: string
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const { handleTermChange } = useSearchParams()

  useEffect(() => {
    setIsOpen(initialIsOpen)
  }, [initialIsOpen, playbackId])

  const handleClose = () => {
    if (isOpen) {
      handleTermChange([{ key: 'previewId', value: '' }])
      setIsOpen(false)
    }
  }

  console.log(playbackId)
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-transparent max-w-4xl w-full text-white">
        <div className="p-4 space-y-2 ">
          <Player
            src={[
              {
                src: `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <DialogFooter className="text-black">
            <ShareButton />
            <Button onClick={() => deleteSessionAction({
              organizationId,
              sessionId: playbackId,
            })}>
              Delete
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Preview
