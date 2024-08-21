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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import UploadToYoutubeButton from './components/UploadToYoutubeButton';
import { fetchOrganization } from '@/lib/services/organizationService';
import { getVideoUrlAction } from '@/lib/actions/livepeer';

const EditSession = async ({ params, searchParams }: studioPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });
  const session = await fetchSession({
    session: params.session,
  });

  if (!session?.playbackId) return notFound();

  const videoUrl = await getVideoUrlAction(session);
  if (!videoUrl) return notFound();

  return (
    <div className="overflow-auto p-4 h-full">
      <Link href={`/studio/${params.organization}/library`}>
        <div className="flex justify-start items-center mb-4 space-x-4">
          <ArrowLeft />
          <p>Back to library</p>
        </div>
      </Link>
      <div className="flex overflow-auto flex-col gap-4 md:flex-row">
        <div className="p-4 space-y-4 bg-white rounded-xl border md:w-2/3">
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
                src: videoUrl as `${string}m3u8`,
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
              className="px-4 bg-white rounded-xl border"
              value="publishVideo"
              defaultChecked
            >
              <AccordionTrigger>
                <h1 className="text-lg font-bold">Publish video</h1>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  <div className="min-w-[200px]">
                    <GetHashButton session={session} />
                  </div>

                  <UploadToYoutubeButton
                    organization={organization}
                    organizationSlug={params.organization}
                    sessionId={session._id}
                  />

                  {/* <UploadTwitterButton
                    organization={organization}
                    organizationSlug={params.organization}
                    sessionId={session._id}
                  /> */}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="px-4 bg-white rounded-xl border"
              value="videoData"
            >
              <AccordionTrigger>
                <h1 className="text-lg font-bold">Video data</h1>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
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
  );
};

export default EditSession;
