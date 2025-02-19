import VideoEditorSidebar from './EditorSidebar';
import PlayerComponent from './player';
import Timeline from './timeline';
import { TimelineProvider } from './context/TimelineContext';
import { EditorProvider } from './context/EditorContext';
import { fetchSession } from '@/lib/services/sessionService';
import { EditorEvent } from './types';
import { ParseSessionMediaAction } from '@/lib/actions/sessions';
import InfoSidebar from './InfoSidebar';
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

  // Fetch video metadata server-side
  const metadata = await ParseSessionMediaAction({
    assetId: session.assetId,
  });

  const initialEvent: EditorEvent = {
    id: session._id,
    label: session.name,
    type: 'media',
    start: 0,
    timeLineStart: 0,
    duration: metadata.durationInSeconds,
    end: metadata.durationInSeconds,
    timeLineEnd: metadata.durationInSeconds,
    url: metadata.videoUrl,
    fps: metadata.fps,
    transcript: {
      language: 'en',
      duration: metadata.durationInSeconds,
      words: session.transcripts?.chunks ?? [],
      text: session.transcripts?.text ?? '',
    },
  };

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <EditorProvider initialSessions={[session]}>
      <TimelineProvider initialEvents={[initialEvent]}>
        <div className="flex flex-col h-screen bg-background w-full">
          <div className="flex flex-row h-[60%]">
            <div className="w-1/4 flex h-full">
              <VideoEditorSidebar />
            </div>
            <div className="w-2/4 flex h-full">
              <PlayerComponent />
            </div>
            <div className="w-1/4 flex h-full">
              <InfoSidebar />
            </div>
          </div>
          <div className="h-[40%] bg-muted w-full">
            <Timeline />
          </div>
        </div>
      </TimelineProvider>
    </EditorProvider>
  );
}
