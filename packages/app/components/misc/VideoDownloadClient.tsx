'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { apiUrl, cn } from '@/lib/utils/utils'
import { useState } from 'react'

const VideoDownloadClient = ({
  videoName,
  assetId,
  variant,
  className,
  collapsable = false,
}: {
  videoName: string
  assetId?: string
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

  
  const [loading, setLoading] = useState(false)
  if (!assetId) {
    return null
  }
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
    setLoading(true)
    try {
      const downloadUrl = await fetchDownloadUrl(assetId)

      // Create a temporary anchor element
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', videoName) // Set the desired file name

      // Append the anchor to the body
      document.body.appendChild(link)

      // Trigger the download by simulating a click
      link.click()

      // Clean up by removing the anchor element
      document.body.removeChild(link)

      toast.success('Download started')
      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast.error('Failed to download video')
    }
  }

  return (
    <Button
      disabled={loading}
      onClick={handleDownload}
      variant={variant}
      className={className}>
      <Download className="h-5 w-5" />
      <p className={cn(collapsable && 'flex')}>
        {loading ? 'Downloading...' : 'Download'}
      </p>
    </Button>
  )
}

export default VideoDownloadClient
