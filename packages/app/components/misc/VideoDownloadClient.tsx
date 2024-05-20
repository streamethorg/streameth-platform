'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

const VideoDownloadClient = ({
  videoName,
  playbackId,
  variant,
  className,
}: {
  videoName: string
  playbackId: string
  variant?:
    | 'primary'
    | 'default'
    | 'destructive'
    | 'destructive-outline'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'green'
    | 'link'
  className?: string
}) => {
  const handleDownload = async () => {
    try {
      // TODO: downloadUrl works, but should not be hardcoded
      const downloadUrl = `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/video`
      const response = await fetch(downloadUrl)
      if (!response.ok)
        throw new Error('Network response was not ok.')

      const data = await response.blob()
      const blobUrl = window.URL.createObjectURL(data)
      const link = document.createElement('a')

      link.href = blobUrl
      link.setAttribute('download', videoName)
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
    <Button
      onClick={handleDownload}
      variant={variant}
      className={className}>
      <Download size={21} />
      <p className="hidden xl:flex">Download</p>
    </Button>
  )
}

export default VideoDownloadClient
