import Player from '@/components/ui/Player';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Livepeer } from 'livepeer';
import { getSrc } from '@livepeer/react/external';
import { EmbedPageParams } from '@/lib/types';

const Embed = ({
  vod,
  playbackId,
  videoSrc,
}: {
  videoSrc?: string;
  playbackId: string;
  vod?: string;
}) => {
  const getVideoUrl = () => {
    if (vod === 'true') return videoSrc;
    return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
  };

  return (
    <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black">
      <Player
        src={[
          {
            src: getVideoUrl() as `${string}m3u8`,
            width: 1920,
            height: 1080,
            mime: 'application/vnd.apple.mpegurl',
            type: 'hls',
          },
        ]}
      />
    </div>
  );
};
const EmbedPage = async ({ searchParams }: EmbedPageParams) => {
  if (!searchParams.playbackId) {
    return notFound();
  }
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  });

  const playbackInfo = await livepeer.playback.get(searchParams.playbackId);
  const src = getSrc(playbackInfo.playbackInfo);

  return (
    <Suspense>
      <Embed
        playbackId={searchParams?.playbackId}
        vod={searchParams.vod}
        videoSrc={src?.[1].src}
      />
    </Suspense>
  );
};

export default EmbedPage;
