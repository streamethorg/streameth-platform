import { Livepeer } from 'livepeer'
import { ArrowDownToLine, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const VideoDownload = async ({ assetId }: { assetId: string }) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  if (!assetId) return null

  const asset = (await livepeer.asset.get(assetId)).asset

  if (!asset) return null

  return (
    <a
      href={asset.downloadUrl}
      download={asset.name}
      target="_blank"
      className="flex items-center justify-center">
      <Button className="bg-white" variant="outline">
        <Download size={24} className="cursor-pointer p-1" />
        Download
      </Button>
    </a>
  )
}

export default VideoDownload
