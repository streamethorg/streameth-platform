'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/utils'
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
  const fetchAssetDetails = async (assetId: string) => {
    const response = await fetch(
      `https://livepeer.studio/api/asset/${assetId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch asset details')
    }

    const assetData = await response.json()
    return assetData
  }

  const handleDownload = async () => {
    try {
      const assetData = await fetchAssetDetails(assetId)
      const downloadUrl = assetData.downloadUrl

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
