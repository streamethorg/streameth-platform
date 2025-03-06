import { fetchAllSessions, fetchSession } from '@/lib/services/sessionService';
import { fetchStage, fetchStageRecordings } from '@/lib/services/stageService';
import {
  ClipsPageParams,
  IExtendedSession,
  IExtendedStage,
  IMetadata,
} from '@/lib/types';
import React from 'react';
import { ClipPageProvider } from './ClipPageContext';
import Controls from './Controls';
import Timeline from './Timeline';
import Sidebar from './sidebar';
import TopBar from './topBar';
import { getVideoUrlAction } from '@/lib/actions/livepeer';
import { MarkersProvider } from './sidebar/markers/markersContext';
import { ClipsSidebarProvider } from './sidebar/clips/ClipsContext';
import { getLiveStageSrcValue } from '@/lib/utils/utils';
import { TimelineProvider } from './Timeline/TimelineContext';
import { TrimmControlsProvider } from './Timeline/EventConntext';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import PlayerComponent from './Player';
import { ParseSessionMediaAction } from '@/lib/actions/sessions';
import {
  ITranscript,
  IAiAnalysis,
} from 'streameth-new-server/src/interfaces/transcribe.interface';
import type { Session } from 'livepeer/models/components';

const fetchVideoDetails = async (
  videoType: string,
  stageId: string,
  sessionId?: string
): Promise<{
  name: string;
  sessions: IExtendedSession[];
  transcripts: ITranscript | null;
  aiAnalysis: IAiAnalysis | null;
  metadata: IMetadata;
  stageRecordings: Session[];
  type: string;
} | null> => {
  try {
    let stage: IExtendedStage | null, videoSrc, name, transcripts, aiAnalysis;

    if (videoType === 'livestream') {
      stage = await fetchStage({ stage: stageId });
      const streamId = stage?.streamSettings?.streamId;
      if (!streamId || !stage) return null;

      const stageRecordings = await fetchStageRecordings({ streamId });
      if (!stageRecordings?.length) return null;

      videoSrc = getLiveStageSrcValue({
        playbackId: stageRecordings[0].playbackId,
        recordingId: stageRecordings[0].id,
      });
      name = stage.name;
      transcripts = stage.transcripts;
      aiAnalysis = stage.aiAnalysis;
    } else if (videoType === 'recording') {
      const session = await fetchSession({ session: sessionId! });
      if (!session?.stageId || !session?.playbackId || !session?.assetId)
        return null;

      stage = await fetchStage({ stage: session.stageId as string });
      videoSrc = await getVideoUrlAction(session);
      name = session.name;
      transcripts = session.transcripts;
      aiAnalysis = session.aiAnalysis;
    } else {
      return null;
    }

    if (!videoSrc) return null;

    const stageRecordings = await fetchStageRecordings({
      streamId: stage?.streamSettings?.streamId || '',
    });

    const sessions =
      (
        await fetchAllSessions({
          stageId: stage?._id || '',
          type: SessionType.livestream,
        })
      ).sessions || [];

    const metadata = await ParseSessionMediaAction({ videoUrl: videoSrc });

    return {
      name,
      transcripts: transcripts || null,
      aiAnalysis: aiAnalysis || null,
      sessions,
      type: 'livepeer',
      stageRecordings,
      metadata,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
  const { organization: organizationId, stageId } = params;
  const { videoType, sessionId } = searchParams;

  const videoDetails = await fetchVideoDetails(videoType, stageId, sessionId);
  if (!videoDetails) {
    return <div>Video source not found</div>;
  }

  const { metadata, name, sessions, stageRecordings, transcripts, aiAnalysis } =
    videoDetails;

  return (
    <ClipPageProvider
      transcript={transcripts}
      metadata={metadata}
      stageId={stageId}
      sessionId={sessionId}
    >
      <TimelineProvider>
        <MarkersProvider>
          <ClipsSidebarProvider>
            <TrimmControlsProvider>
              <div className="flex flex-row w-full h-full border-t border-gray-200 overflow-hidden">
                <div className="flex h-full w-[calc(100%-400px)] flex-col">
                  <TopBar
                    stageRecordings={stageRecordings}
                    allSessions={sessions}
                    name={name}
                    organizationId={organizationId}
                    stageId={stageId}
                    sessionId={sessionId}
                  />
                  <PlayerComponent />
                  <Controls />
                  <div className="w-full p-2 bg-white">
                    <Timeline />
                  </div>
                </div>
                <div className="flex w-[400px] h-full">
                  <Sidebar aiAnalysis={aiAnalysis} />
                </div>
              </div>
            </TrimmControlsProvider>
          </ClipsSidebarProvider>
        </MarkersProvider>
      </TimelineProvider>
    </ClipPageProvider>
  );
};

export default ClipsConfig;
