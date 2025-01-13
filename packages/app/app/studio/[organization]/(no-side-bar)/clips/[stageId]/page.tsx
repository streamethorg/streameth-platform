import { fetchOrganization } from '@/lib/services/organizationService';
import {
  fetchAllSessions,
  fetchSession
} from '@/lib/services/sessionService';
import { fetchStage, fetchStageRecordings } from '@/lib/services/stageService';
import { ClipsPageParams } from '@/lib/types';
import { notFound } from 'next/navigation';
import React from 'react';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { ClipProvider } from './ClipContext';
import Controls from './Controls';
import ReactHlsPlayer from './Player';
import Timeline from './Timeline';
import Sidebar from './sidebar';
import TopBar from './topBar';
import { getVideoUrlAction } from '@/lib/actions/livepeer';

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

      const stageRecordings = await fetchStageRecordings({ streamId });
      if (!stageRecordings?.recordings[0]) return null;
      return {
        videoSrc: `https://livepeercdn.studio/hls/${liveStage.streamSettings?.playbackId}/index.m3u8`,
        type: 'livepeer',
        name: liveStage.name,
        words: liveStage.transcripts?.chunks,
        liveRecording: stageRecordings.recordings[0],
      };
    }

    case 'recording': {
      const session = await fetchSession({ session: sessionId! });
      if (!session?.playbackId || !session?.assetId) return null;

      const stage = await fetchStage({ stage: session.stageId as string });
      if (!stage?.streamSettings?.playbackId) return null;
      const videoSrc = await getVideoUrlAction(session);
      return {
        videoSrc,
        type: 'livepeer',
        name: session.name,
        words: session.transcripts?.chunks,
      };
    }

    case 'customUrl': {
      const stage = await fetchStage({ stage: stageId });
      if (!stage?.source?.m3u8Url) return null;

      return {
        videoSrc: stage.source.m3u8Url,
        type: stage.source.type,
        name: stage.name,
        words: stage.transcripts?.chunks,
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

  const [stageSessions, animations] = await Promise.all([
    fetchAllSessions({
      stageId,
      type: SessionType.clip,
    }),
    fetchAllSessions({
      organizationSlug: organization,
      onlyVideos: true,
      type: SessionType.animation,
    }),
  ]);

  return (
    <ClipProvider
      organizationId={organizationId}
      stageId={stageId}
      clipUrl={videoDetails.videoSrc}
    >
      <div className="flex flex-row w-full h-full border-t border-gray-200 overflow-hidden">
        <div className="flex h-full w-[calc(100%-400px)] flex-col">
          <TopBar title={videoDetails.name} organization={organization} />
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
            sessionId={sessionId}
            liveRecordingId={videoDetails.liveRecording?.id}
            stageSessions={stageSessions.sessions}
            organizationId={organizationId}
            animations={animations.sessions}
            words={videoDetails.words}
            stageId={stageId}
          />
        </div>
      </div>
    </ClipProvider>
  );
};

export default ClipsConfig;
