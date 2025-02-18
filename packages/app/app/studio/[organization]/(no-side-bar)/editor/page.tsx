import VideoEditorSidebar from './EditorSidebar';
import PlayerComponent from './player';
import Timeline from './timeline';
import { TimelineProvider } from './context/TimelineContext';
import { EditorProvider } from './context/EditorContext';
import {
  fetchAsset,
  fetchSession,
} from '@/lib/services/sessionService';
import { parseMedia } from '@remotion/media-parser';
import { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { EditorEvent } from './types';

export const captionedVideoSchema = z.object({
  src: z.string(),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
  const metadata = await parseMedia({
    src: props.src,
    fields: {
      durationInSeconds: true,
      dimensions: true,
      fps: true,
    },
  });
  
  console.log('metadata', metadata);
  return {
    fps: metadata.fps === 0 ? 30 : metadata.fps,
    durationInSeconds: metadata.durationInSeconds ?? 0,
    width: metadata.dimensions?.width ?? 0,
    height: metadata.dimensions?.height ?? 0,
  };
};

export default async function VideoEditorLayout({
  params,
  searchParams,
}: {
  params: { organization: string };
  searchParams: { sessionId: string };
}) {
  const { sessionId } = searchParams;
  const session = await fetchSession({ session: sessionId });
  if (!session?.playbackId) {
    return <div>Session not found</div>;
  }
  if (!session?.assetId) {
    return <div>Asset not found</div>;
  }
  const asset = await fetchAsset({ assetId: session?.assetId });

  const videoUrl = asset?.downloadUrl;
  console.log('videoUrl', videoUrl);

  // Fetch video metadata server-side
  const metadata = await calculateCaptionedVideoMetadata({
    props: { src: videoUrl },
    defaultProps: { src: videoUrl },
    abortSignal: AbortSignal.timeout(1_000 * 60 * 5),
    compositionId: '',
  });

  const initialEvent: EditorEvent = {
    id: 'main',
    label: 'main',
    type: 'media',
    start: 0, 
    timeLineStart: 0,
    duration: metadata.durationInSeconds,
    end: metadata.durationInSeconds,
    timeLineEnd: metadata.durationInSeconds,
    url: videoUrl,
    transcript: {
      language: 'en',
      duration: metadata.durationInSeconds,
      words: session.transcripts?.chunks,
      text: session.transcripts?.text,
    },
  };

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <EditorProvider>
      <TimelineProvider initialEvent={initialEvent} fps={metadata.fps ?? 30}>
        <div className="flex flex-col h-screen bg-background w-full">
          <div className="flex flex-row h-2/3">
            <div className="w-1/3 flex h-full">
                <VideoEditorSidebar />
              </div>
              <div className="w-2/3 flex h-full">
                <PlayerComponent />
              </div>
            </div>
            <div className="h-1/3 bg-muted w-full">
              <Timeline />
            </div>
          </div>
        </TimelineProvider>
      </EditorProvider>
  );
}
