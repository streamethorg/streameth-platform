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
import { toast } from 'sonner'
import { Asset } from 'livepeer/models/components'

const Preview = ({
  initialIsOpen,
  asset,
  organizationId,
  sessionId,
  organizationSlug,
}: {
  initialIsOpen: boolean
  asset: Asset
  organizationId: string
  sessionId: string
  organizationSlug: string
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
      <DialogContent className="w-full max-w-4xl bg-transparent text-white">
        <div className="space-y-2 p-4">
          {status?.phase === 'processing' ? (
            <div className="flex aspect-video flex-col items-center justify-center rounded-lg bg-background p-4 text-black">
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
          <DialogFooter className="flex flex-row text-black">
            {/* <Button
              className="mr-auto"
              variant={'destructive'}
              onClick={handleDelete}>
              Delete
            </Button> */}

            <ShareButton
              url={`${location.origin}/${organizationSlug}/watch?session=${sessionId}`}
              shareFor="video"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Preview
