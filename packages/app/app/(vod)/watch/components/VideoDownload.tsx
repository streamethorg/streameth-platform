import { Livepeer } from 'livepeer'
import { Badge } from '@/components/ui/badge'

import { ArrowDownToLine } from 'lucide-react'

const VideoDownload = async ({ assetId }: { assetId: string }) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const asset = (await livepeer.asset.get(assetId)).asset

  if (!asset) return null

  return (
    <a
      href={asset.downloadUrl}
      download={asset.name}
      target="_blank"
      className="flex justify-center items-center">
      <Badge className="bg-secondary text-secondary-foreground">
        <ArrowDownToLine size={24} className="p-1 cursor-pointer" />
        Download
      </Badge>
    </a>
  )
}

export default VideoDownload
