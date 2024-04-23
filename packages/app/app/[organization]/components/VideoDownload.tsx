import { Livepeer } from 'livepeer'
import { ArrowDownToLine } from 'lucide-react'
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
      className="flex justify-center items-center">
      <Button className="bg-white" variant="outline">
        <ArrowDownToLine size={24} className="p-1 cursor-pointer" />
        Download
      </Button>
    </a>
  )
}

export default VideoDownload
