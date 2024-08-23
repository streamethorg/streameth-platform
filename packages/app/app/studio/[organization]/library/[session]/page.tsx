'use server';

import { studioPageParams } from '@/lib/types';
import { fetchSession } from '@/lib/services/sessionService';
import { PlayerWithControls } from '@/components/ui/Player';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import EditSessionForm from './components/EditSessionForm';
import Link from 'next/link';
import SessionOptions from './components/SessionOptions';
import { Label } from '@/components/ui/label';
import GetHashButton from '../components/GetHashButton';
import TextPlaceholder from '@/components/ui/text-placeholder';
import { Button } from '@/components/ui/button';
import { SiTwitter } from 'react-icons/si';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import UploadToYoutubeButton from './components/UploadToYoutubeButton';
import { fetchOrganization } from '@/lib/services/organizationService';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import UploadTwitterButton from './components/UploadTwitterButton';

const EditSession = async ({ params, searchParams }: studioPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });
  const session = await fetchSession({
    session: params.session,
  });

  // Check if session exists and has a playbackId. If not, return a 'not found' response.
  if (!session?.playbackId) return notFound();

  const videoUrl = await getVideoUrlAction(session);

  // If we couldn't get a video URL, return a 'not found' response.
  if (!videoUrl) return notFound();

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      <div className="mb-4">
        <Link href={`/studio/${params.organization}/library`}>
          <div className="flex items-center space-x-4">
            <ArrowLeft />
            <p>Back to library</p>
          </div>
        </Link>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Column - Video Details (2/3 width) */}
        <div className="w-2/3 pr-4 overflow-auto">
          <div className="rounded-xl border bg-white p-4 pb-6">
            <h1 className="text-lg font-bold mb-4">Video Details</h1>
            <EditSessionForm
              session={session}
              organizationSlug={params.organization}
            />
          </div>
        </div>

        {/* Right Column - Player and Accordions (1/3 width) */}
        <div className="w-1/3 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 mb-4">
            <PlayerWithControls
              src={[
                {
                  src: videoUrl as `${string}m3u8`,
                  width: 1920,
                  height: 1080,
                  mime: 'application/vnd.apple.mpegurl',
                  type: 'hls',
                },
              ]}
            />
          </div>

          <div className="flex-grow overflow-auto">
            <Accordion
              className="space-y-2"
              type="multiple"
              defaultValue={['publishVideo', 'menu']}
            >
              <AccordionItem defaultChecked value="menu">
                <AccordionContent>
                  <SessionOptions
                    name={session.name}
                    sessionId={params.session}
                    organizationSlug={params.organization}
                    playbackId={session.playbackId!}
                    assetId={session.assetId}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="rounded-xl border bg-white"
                value="publishVideo"
                defaultChecked
              >
                <AccordionTrigger className="px-4">
                  <h1 className="text-lg font-bold">Publish video</h1>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="min-w-[200px]">
                      <GetHashButton session={session} />
                    </div>
                    <UploadToYoutubeButton
                      organization={organization}
                      organizationSlug={params.organization}
                      sessionId={session._id}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="rounded-xl border bg-white"
                value="videoData"
              >
                <AccordionTrigger className="px-4">
                  <h1 className="text-lg font-bold">Video data</h1>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
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
                      <TextPlaceholder text={session.videoTranscription} />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSession;
