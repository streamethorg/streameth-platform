'use server'

import { studioPageParams } from '@/lib/types'
import { fetchSession } from '@/lib/services/sessionService'
import { PlayerWithControls } from '@/components/ui/Player'
import { Livepeer } from 'livepeer'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import EditSessionForm from './components/EditSessionForm'
import Link from 'next/link'
import SessionOptions from './components/SessionOptions'
import { Label } from '@/components/ui/label'
import GetHashButton from '../components/GetHashButton'
import TextPlaceholder from '@/components/ui/text-placeholder'
import { Button } from '@/components/ui/button'
import { SiTwitter } from 'react-icons/si'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import UploadToYoutubeButton from './components/UploadToYoutubeButton'
import { fetchOrganization } from '@/lib/services/organizationService'

const EditSession = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
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

  return (
    <div className="p-4 h-full overflow-auto">
      <Link href={`/studio/${params.organization}/library`}>
        <div className="flex justify-start items-center mb-4 space-x-4">
          <ArrowLeft />
          <p>Back to library</p>
        </div>
      </Link>

      <div className="flex flex-col md:flex-row gap-4 overflow-auto">
        <div className="p-4 space-y-4 md:w-2/3 bg-white rounded-xl border">
          <h1 className="text-lg font-bold">Video Details</h1>
          <EditSessionForm
            session={session}
            organizationSlug={params.organization}
          />
        </div>
        <div className="flex flex-col space-y-4 md:w-1/3">
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

          <Accordion
            className="space-y-4"
            type="multiple"
            defaultValue={['publishVideo', 'menu']}>
            <AccordionItem defaultChecked value="menu">
              <AccordionContent>
                <SessionOptions
                  name={video.name}
                  sessionId={params.session}
                  organizationSlug={params.organization}
                  playbackId={video.playbackId!}
                  assetId={session.assetId}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="bg-white rounded-xl border px-4"
              value="publishVideo"
              defaultChecked>
              <AccordionTrigger>
                <h1 className="text-lg font-bold">Publish video</h1>
              </AccordionTrigger>
              <AccordionContent>
                <div className="gap-2 flex flex-wrap">
                  <div className="min-w-[200px]">
                    <GetHashButton session={session} />
                  </div>
                  {session?.socials?.some(
                    (s) => s.name === 'youtube'
                  ) ? (
                    <Button variant="outline">
                      Video Published to Youtube
                    </Button>
                  ) : (
                    <UploadToYoutubeButton
                      organization={organization}
                      organizationSlug={params.organization}
                      sessionId={session._id}
                    />
                  )}
                  <Button
                    disabled
                    className="bg-[#121212] min-w-[200px]">
                    <SiTwitter className="mr-2" /> Publish to
                    X(Twitter) (Coming Soon)
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="bg-white rounded-xl border px-4"
              value="videoData">
              <AccordionTrigger>
                <h1 className="text-lg font-bold">Video data</h1>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 ">
                {session.playbackId && (
                  <div>
                    <Label>Playback Id</Label>
                    <TextPlaceholder text={session.playbackId} />
                  </div>
                )}
                {session.assetId && (
                  <div>
                    <Label>Asset Id</Label>
                    <TextPlaceholder text={session.assetId} />
                  </div>
                )}
                {session.videoTranscription && (
                  <div>
                    <Label>Transcript</Label>
                    <TextPlaceholder
                      text={session.videoTranscription}
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default EditSession
