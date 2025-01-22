import { fetchOrganization } from '@/lib/services/organizationService';
import { fetchSession } from '@/lib/services/sessionService';
import { fetchStage, fetchStageRecordings } from '@/lib/services/stageService';
import { ClipsPageParams } from '@/lib/types';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import { ClipProvider } from './ClipContext';
import Controls from './Controls';
import ReactHlsPlayer from './Player';
import Timeline from './Timeline';
import Sidebar from './sidebar';
import TopBar from './topBar';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import { MarkersProvider } from './sidebar/markers/markersContext';
import { ClipsSidebarProvider } from './sidebar/clips/ClipsContext';
import { getLiveStageSrcValue } from '@/lib/utils/utils';
const fetchVideoDetails = async (
  videoType: string,
  stageId: string,
  sessionId?: string
) => {
  switch (videoType) {
    case 'livestream': {
      const liveStage = await fetchStage({ stage: stageId });
      const streamId = liveStage?.streamSettings?.streamId;
      if (!streamId) return null;
      const allRecordings = await fetchStageRecordings({ streamId });
      if (!allRecordings) return null;
      const latestRecording = allRecordings[0];
      return {
        videoSrc: getLiveStageSrcValue({
          playbackId: latestRecording.playbackId,
          recordingId: latestRecording.id,
        }),
        type: 'livepeer',
        name: liveStage.name,
        transcribe: liveStage.transcripts?.chunks,
        transcibeStatus: liveStage.transcripts?.status,
      };
    }

    case 'recording': {
      const session = await fetchSession({ session: sessionId! });
      if (!session?.playbackId || !session?.assetId) return null;
      // const stage = await fetchStage({ stage: session.stageId as string });
      // if (!stage?.streamSettings?.playbackId) return null;
      const videoSrc = await getVideoUrlAction(session);
      return {
        videoSrc,
        type: 'livepeer',
        name: session.name,
        transcribe: session.transcripts?.chunks,
        transcribeStatus: session.transcripts?.status,
        aiAnalysisStatus: session.aiAnalysis?.status,
      };
    }

    case 'customUrl': {
      const stage = await fetchStage({ stage: stageId });
      if (!stage?.source?.m3u8Url) return null;

      return {
        videoSrc: stage.source.m3u8Url,
        type: stage.source.type,
        name: stage.name,
        transcribe: stage.transcripts?.chunks,
      };
    }

    default:
      return null;
  }
};

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
  const { organization, stageId } = params;
  const { videoType, sessionId } = searchParams;

  const organizationId = (
    await fetchOrganization({ organizationSlug: organization })
  )?._id;
  if (!organizationId) return notFound();

  const videoDetails = await fetchVideoDetails(videoType, stageId, sessionId);
  if (!videoDetails?.videoSrc || !videoDetails?.type || !videoDetails?.name) {
    return <div>Video source not found</div>;
  }

  return (
    <ClipProvider
      organizationId={organizationId}
      stageId={stageId}
      clipUrl={videoDetails.videoSrc}
    >
      <MarkersProvider
        organizationId={organizationId}
        stageId={stageId}
        sessionId={sessionId}
      >
        <ClipsSidebarProvider>
          <div className="flex flex-row w-full h-full border-t border-gray-200 overflow-hidden">
            <div className="flex h-full w-[calc(100%-400px)] flex-col">
              <Suspense
                fallback={
                  <div className="p-2 w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                    Loading...
                  </div>
                }
              >
                <TopBar
                  stageId={stageId}
                  organization={organization}
                  sessionId={sessionId}
                />
              </Suspense>
              <ReactHlsPlayer
                src={videoDetails.videoSrc}
                type={videoDetails.type}
              />
              <Controls />
              <div className="w-full p-2 bg-white">
                <Timeline />
              </div>
            </div>
            <div className="flex w-[400px] h-full">
              <Sidebar
                transcribe={videoDetails.transcribe || []}
                sessionId={sessionId || ''}
                transcribeStatus={videoDetails.transcribeStatus ?? null}
                aiAnalysisStatus={videoDetails.aiAnalysisStatus ?? null}
              />
            </div>
          </div>
        </ClipsSidebarProvider>
      </MarkersProvider>
    </ClipProvider>
  );
};

export default ClipsConfig;
