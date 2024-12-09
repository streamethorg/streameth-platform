'use client';
import React from 'react';
import CopyText from '../../../../../../../components/misc/CopyText';
import { IExtendedStage } from '@/lib/types';
import dynamic from 'next/dynamic';

const ClientSidePlayer = dynamic(() => import('./ClientSidePlayer'), {
  ssr: false,
});

const StreamConfigWithPlayer = ({
  stream,
  isLive,
}: {
  stream: IExtendedStage;
  isLive?: boolean;
}) => {
  const streamKey = stream?.streamSettings?.streamKey;

  return (
    <>
      <div className="w-full aspect-video">
        {!isLive ? (
          <div className="flex flex-col justify-center items-center p-4 w-full h-full text-white bg-black rounded-lg">
            <h3 className="mb-2 text-3xl font-semibold text-center lg:text-4xl">
              Connect your Streaming providers
            </h3>
            <p className="mb-6 text-lg text-center lg:w-3/4">
              Copy and paste the stream key into your streaming software. Use
              either the RTMP or SRT ingest, depending on your use-case. The
              RTMP ingest is more common with OBS users
            </p>
            <div className="flex flex-col gap-3">
              <CopyText
                label="RTMP Ingest"
                text="rtmp://rtmp.livepeer.com/live"
              />
              <CopyText
                label="SRT Ingest"
                text={`srt://rtmp.livepeer.com:2935?streamid=${streamKey}&mode=caller`}
              />
              <CopyText label="Stream key" text={streamKey} />
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video">
            <ClientSidePlayer
              name={stream.name || 'Live Stream'}
              thumbnail=""
              src={[
                {
                  src: `https://livepeercdn.studio/hls/${stream?.streamSettings?.playbackId}/index.m3u8`,
                  width: 1920,
                  height: 1080,
                  mime: 'application/vnd.apple.mpegurl',
                  type: 'hls',
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StreamConfigWithPlayer;
