'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { apiUrl, cn } from '@/lib/utils/utils'
import Collection from '@/app/[organization]/collection/page'

const VideoDownloadClient = ({
  videoName,
  assetId,
  variant,
  className,
  collapsable = false,
}: {
  videoName: string
  assetId: string
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
  collapsable?: boolean
}) => {
  const fetchDownloadUrl = async (assetId: string) => {
    const response = await fetch(
      `${apiUrl()}/streams/asset/${assetId}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch asset details')
    }

    return (await response.json()).data
  }

  const handleDownload = async () => {
    try {
      const downloadUrl = await fetchDownloadUrl(assetId)

      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }

      const data = await response.blob()
      const blobUrl = window.URL.createObjectURL(data)
      const link = document.createElement('a')

      link.href = blobUrl
      link.setAttribute('download', videoName)
      document.body.appendChild(link)

      link.click()
      link.parentNode!.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      toast.success('Successfully downloaded the video')
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
      <p className={cn(collapsable && 'hidden xl:flex')}>Download</p>
    </Button>
  )
}

export default VideoDownloadClient
