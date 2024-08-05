import Player from '@/components/ui/Player';
import SessionInfoBox from '@/components/sessions/SessionInfoBox';
import { fetchAllSessions } from '@/lib/data';
import { fetchStage } from '@/lib/services/stageService';
import { fetchChat } from '@/lib/services/chatService';
import { Livepeer } from 'livepeer';
import { buildPlaybackUrl } from '@/lib/utils/utils';
import { IExtendedEvent } from '@/lib/types';
export default async function StageComponent({
  event,
  stageId,
}: {
  event: IExtendedEvent;
  stageId: string;
}) {
  const stage = await fetchStage({
    stage: stageId,
  });

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  });

  if (!stage || !event) {
    return null;
  }

  const prevChatMessages = await fetchChat({ stageId: stage?._id });
  const stream = (
    await livepeer.stream.get(stage.streamSettings?.streamId ?? '')
  ).stream;

  if (!stream || !stream.playbackId) {
    return null;
  }

  const sessionsData = await fetchAllSessions({ stageId: stage._id });
  const currentSession = sessionsData.sessions.find((s) => {
    return s.start < Date.now() && s.end > Date.now();
  });

  return (
    <div className="relative flex w-full flex-col gap-2 md:flex-row lg:max-h-[calc(100vh-54px)]">
      <div className="top-[54px] z-40 flex w-full flex-col gap-2 md:h-full md:w-full md:overflow-auto">
        <Player
          src={[
            {
              src: buildPlaybackUrl(stream.playbackId) as `${string}m3u8`,
              width: 1920,
              height: 1080,
              mime: 'application/vnd.apple.mpegurl',
              type: 'hls',
            },
          ]}
        />
        <SessionInfoBox
          name={'Watching: ' + stage.name}
          description={stage.description || 'No description'}
          date={stage.createdAt as string}
          playbackId={stream.playbackId}
        />
      </div>
    </div>
  );
}
