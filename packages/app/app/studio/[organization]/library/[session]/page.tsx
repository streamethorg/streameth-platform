import { studioPageParams } from '@/lib/types'
import { fetchSession } from '@/lib/services/sessionService'
import { PlayerWithControls } from '@/components/ui/Player'
import { Livepeer } from 'livepeer'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, Download, Share2 } from 'lucide-react'
import EditSessionFrom from './components/EditSessionForm'
import Link from 'next/link'
import EmbedButton, {
  EmbedModalContent,
} from '@/components/misc/interact/EmbedButton'
import { ShareModalContent } from '@/components/misc/interact/ShareButton'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

const EditSession = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const session = await fetchSession({
    session: params.session,
  })

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  if (!session || !session.assetId) {
    return notFound()
  }

  const video = (await livepeer.asset.get(session.assetId)).asset

  if (!video) return notFound()

  console.log(video)

  return (
    <div className="p-2 h-full">
      <Link href={`/studio/${params.organization}/library`}>
        <div className="flex justify-start items-center my-4 mx-10 space-x-4">
          <ArrowLeft />
          <p>Back to library</p>
        </div>
      </Link>

      <div className="flex flex-row space-x-4">
        <div className="px-10 space-y-4 w-2/3">
          <h1 className="text-5xl font-bold">Video Details</h1>
          <EditSessionFrom session={session} />
        </div>
        <div className="w-1/3">
          <PlayerWithControls
            src={[
              {
                src: video.playbackUrl as `${string}m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <div className="flex justify-end my-2 space-x-2">
            <Dialog>
              <DialogTrigger>
                <Button className="space-x-2">
                  <Share2 size={20} />
                  <p>Share</p>
                </Button>
              </DialogTrigger>
              <ShareModalContent />
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <Button className="space-x-2">
                  <Code size={21} />
                  <p>Embed</p>
                </Button>
              </DialogTrigger>
              <EmbedModalContent
                playbackId={video.playbackId}
                playerName={video.name}
              />
            </Dialog>
            <Link
              href={video.downloadUrl!}
              download={video.name}
              target="_blank"
              className="flex justify-center items-center">
              <Button className="space-x-2">
                <Download size={19} />
                <p>Download</p>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSession
