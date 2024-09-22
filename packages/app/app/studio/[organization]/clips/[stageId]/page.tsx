import React from 'react';
import ReactHlsPlayer from './Player';
import { ClipProvider } from './ClipContext';
import Controls from './Controls';
import Timeline from './Timeline';
import Sidebar from './sidebar';
import { ClipsPageParams } from '@/lib/types';
import { fetchStage } from '@/lib/services/stageService';
import { fetchStageRecordings } from '@/lib/services/stageService';
import { fetchSession } from '@/lib/services/sessionService';
import { getLiveStageSrcValue } from '@/lib/utils/utils';
import TopBar from './topBar';

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
  const { organization, stageId } = params;
  const { videoType, sessionId } = searchParams;
  let videoSrc = null;
  let type = null;

  if (videoType === 'livestream' && stageId) {
    // Fetch live recording for the selected stage
    const liveStage = await fetchStage({
      stage: stageId,
    });
    const streamId = liveStage?.streamSettings?.streamId;

    if (!streamId) return <div>live stage not found</div>;

    const stageRecordings = await fetchStageRecordings({ streamId });
    const liveRecording = stageRecordings?.recordings[0] ?? null;

    if (!stageRecordings) return <div>stage recordings not found</div>;
    videoSrc = getLiveStageSrcValue({
      playbackId: liveRecording?.playbackId,
      recordingId: liveRecording?.id,
    });
    type = 'livepeer';
  }

  if (videoType === 'recording' && sessionId) {
    const session = await fetchSession({
      session: sessionId,
    });
    if (!session || !session.videoUrl) return <div>No session found</div>;
    videoSrc = session?.videoUrl;
    type = 'livepeer';
  }

  if (videoType === 'customUrl' && stageId) {
    const stage = await fetchStage({
      stage: stageId,
    });
    if (!stage || !stage?.source?.m3u8Url) return <div>No stage found</div>;
    videoSrc = stage?.source?.m3u8Url;
    type = stage?.source?.type;
  }

  if (!videoSrc || !type) return <div>Video source not found</div>;

  return (
    <ClipProvider stageId={stageId}>
      <div className="flex flex-row w-full h-full">
        <div className="flex h-full w-[calc(100%-400px)] flex-col">
          <TopBar />
          <ReactHlsPlayer src={videoSrc} type={type} />
          <Controls />
          <Timeline />
        </div>
        <div className="flex w-[400px] h-full">
          <Sidebar organizationId={organization} />
        </div>
      </div>
    </ClipProvider>
  );
};

export default ClipsConfig;
