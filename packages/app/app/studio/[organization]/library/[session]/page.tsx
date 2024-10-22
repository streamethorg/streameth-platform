'use server';

import { IExtendedState, studioPageParams } from '@/lib/types';
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
import UploadTwitterButton from './components/UploadTwitterButton';
import SessionTranscriptions from './components/SessionTranscriptions';
import { Button } from '@/components/ui/button';
import { StateType } from 'streameth-new-server/src/interfaces/state.interface';
import { fetchAllStates } from '@/lib/services/stateService';
import ZoraUploadButton from '@/app/speaker/[session]/components/ZoraUploadButton';

const EditSession = async ({ params, searchParams }: studioPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });
  const session = await fetchSession({
    session: params.session,
  });

  if (!session?.playbackId || !organization) return notFound();
  const transcriptionState = await fetchAllStates({
    sessionId: session._id,
    type: StateType.transcrpition,
  });

  const state = (await fetchAllStates({ sessionId: session._id })).filter(
    (state) => state.type === StateType.nft
  ) as IExtendedState[];

  const videoUrl = await getVideoUrlAction(session);
  if (!videoUrl) return notFound();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-4">
      <div className="mb-4">
        <Link href={`/studio/${params.organization}/library`}>
          <Button variant="ghost" className="mb-2 px-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to homepage
          </Button>
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
              caption={session?.transcripts?.subtitleUrl}
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
                    <UploadTwitterButton
                      organization={organization}
                      organizationSlug={params.organization}
                      sessionId={session._id}
                    />
                    <ZoraUploadButton
                      session={session}
                      state={state}
                      variant="primary"
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
                  <SessionTranscriptions
                    videoTranscription={session?.transcripts?.subtitleUrl}
                    organizationId={organization._id}
                    sessionId={session._id}
                    transcriptionState={transcriptionState}
                  />
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
