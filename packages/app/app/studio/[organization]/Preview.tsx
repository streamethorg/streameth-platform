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
import { toast } from 'sonner'
import { Asset } from 'livepeer/dist/models/components'
const Preview = ({
  initialIsOpen,
  asset,
  organizationId,
  sessionId,
}: {
  initialIsOpen: boolean
  asset: Asset
  organizationId: string
  sessionId: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { handleTermChange } = useSearchParams()
  const { status, playbackUrl, playbackId } = asset
  useEffect(() => {
    setIsOpen(initialIsOpen)
  }, [initialIsOpen, playbackId])

  useEffect(() => {
    if (status?.phase === 'processing') {
      const interval = setInterval(() => {
        handleTermChange([
          { key: 'poll', value: new Date().getTime().toString() },
        ])
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [status?.phase, handleTermChange])

  const handleClose = () => {
    if (isOpen) {
      handleTermChange([{ key: 'previewId', value: '' }])
      setIsOpen(false)
    }
  }

  const handleDelete = () => {
    deleteSessionAction({
      organizationId,
      sessionId,
    })
      .then(() => {
        toast.success('Session deleted')
        handleClose()
      })
      .catch(() => {
        toast.error('Error deleting session')
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-transparent max-w-4xl w-full text-white">
        <div className="p-4 space-y-2 ">
          {status?.phase === 'processing' ? (
            <div className="bg-background p-4 rounded-lg flex flex-col items-center justify-center text-black aspect-video">
              <p className="">Video is processing</p>
              <p>
                {(Number(status?.progress?.toFixed(2)) ?? 0) * 100}%
                complete
              </p>
            </div>
          ) : (
            <Player
              src={[
                {
                  src:
                    (playbackUrl as '${string}m3u8') ??
                    `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`,
                  width: 1920,
                  height: 1080,
                  mime: 'application/vnd.apple.mpegurl',
                  type: 'hls',
                },
              ]}
            />
          )}
          <DialogFooter className="text-black flex flex-row">
            <Button
              className="mr-auto"
              variant={'destructive'}
              onClick={handleDelete}>
              Delete
            </Button>

            <ShareButton />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Preview
