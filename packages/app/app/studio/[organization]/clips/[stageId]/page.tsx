import React from 'react';
import ReactHlsPlayer from './Player';
import { ClipProvider } from './ClipContext';
import Controls from './Controls';
import Timeline from './Timeline';
import Sidebar from './sidebar';
import { ClipsPageParams } from '@/lib/types';
import { fetchStage } from '@/lib/services/stageService';
import { fetchStageRecordings } from '@/lib/services/stageService';
import {
  fetchAllSessions,
  fetchAsset,
  fetchSession,
} from '@/lib/services/sessionService';
import { getLiveStageSrcValue } from '@/lib/utils/utils';
import TopBar from './topBar';
import { fetchOrganization } from '@/lib/services/organizationService';
import { notFound } from 'next/navigation';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
  const { organization, stageId } = params;
  const { videoType, sessionId } = searchParams;

  const organizationId = (
    await fetchOrganization({ organizationSlug: organization })
  )?._id;
  if (!organizationId) return notFound();

  let videoSrc = null;
  let type = null;
  let liveRecording = null;

  if (videoType === 'livestream' && stageId) {
    // Fetch live recording for the selected stage
    const liveStage = await fetchStage({
      stage: stageId,
    });
    const streamId = liveStage?.streamSettings?.streamId;

    if (!streamId) return <div>live stage not found</div>;

    const stageRecordings = await fetchStageRecordings({ streamId });
    liveRecording = stageRecordings?.recordings[0] ?? null;

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
    if (!session || !session.playbackId || !session.assetId)
      return <div>No session found</div>;
    const stage = await fetchStage({
      stage: session.stageId as string,
    });
    if (!stage || !stage?.streamSettings?.playbackId)
      return <div>No stage found</div>;

    videoSrc = getLiveStageSrcValue({
      playbackId: stage?.streamSettings?.playbackId,
      recordingId: session?.assetId,
    });
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

  const stageSessions = (
    await fetchAllSessions({
      stageId,
      onlyVideos: true,
      type: SessionType.clip,
    })
  ).sessions;

  return (
    <ClipProvider organizationId={organizationId} stageId={stageId}>
      <div className="flex flex-row w-full h-full">
        <div className="flex h-full w-[calc(100%-400px)] flex-col">
          <TopBar />
          <ReactHlsPlayer src={videoSrc} type={type} />
          <Controls organizationId={organizationId} />
          <div className="w-full p-2 bg-white">
            <Timeline />
          </div>
        </div>
        <div className="flex w-[400px] h-full">
          <Sidebar
            liveRecordingId={liveRecording?.id}
            stageSessions={stageSessions}
            organizationId={organizationId}
          />
        </div>
      </div>
    </ClipProvider>
  );
};

export default ClipsConfig;
