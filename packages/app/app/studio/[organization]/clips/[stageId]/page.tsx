import { fetchOrganization } from '@/lib/services/organizationService';
import {
  fetchAllSessions,
  fetchAsset,
  fetchSession,
} from '@/lib/services/sessionService';
import { fetchStage, fetchStageRecordings } from '@/lib/services/stageService';
import { ClipsPageParams } from '@/lib/types';
import { getLiveStageSrcValue } from '@/lib/utils/utils';
import { notFound } from 'next/navigation';
import React from 'react';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { ClipProvider } from './ClipContext';
import Controls from './Controls';
import ReactHlsPlayer from './Player';
import Timeline from './Timeline';
import Sidebar from './sidebar';
import TopBar from './topBar';

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
      // onlyVideos: true,
      type: SessionType.clip,
    })
  ).sessions;

  const animations = (
    await fetchAllSessions({
      organizationId: organizationId,
      onlyVideos: true,
      type: SessionType.animation,
    })
  ).sessions;

  return (
    <ClipProvider organizationId={organizationId} stageId={stageId}>
      <div className="flex flex-row w-full h-full border-t border-gray-200">
        <div className="flex h-full w-[calc(100%-400px)] flex-col">
          <TopBar />
          <ReactHlsPlayer src={videoSrc} type={type} />
          <Controls />
          <div className="p-2 w-full bg-white">
            <Timeline />
          </div>
        </div>
        <div className="flex overflow-y-auto h-full w-[400px]">
          <Sidebar
            liveRecordingId={liveRecording?.id}
            stageSessions={stageSessions}
            organizationId={organizationId}
            animations={animations}
          />
        </div>
      </div>
    </ClipProvider>
  );
};

export default ClipsConfig;
