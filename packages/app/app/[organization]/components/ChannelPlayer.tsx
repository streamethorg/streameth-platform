import VideoDownload from './VideoDownload';
import ViewCounts from './ViewCounts';
import EmbedButton from '@/components/misc/interact/EmbedButton';
import ShareButton from '@/components/misc/interact/ShareButton';
import PlayerWithControls from '@/components/ui/Player';
import { CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import ChannelShareIcons from './ChannelShareIcons';
import {
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';

const ChannelPlayer = ({
  libraryVideo,
  organization,
  activeStream,
}: {
  libraryVideo: IExtendedSession | null;
  organization: IExtendedOrganization;
  activeStream: IExtendedStage;
}) => {
  const getVideoUrl = () => {
    if (libraryVideo) return libraryVideo?.videoUrl;
    return `https://livepeercdn.studio/hls/${activeStream.streamSettings?.playbackId}/index.m3u8`;
  };

  return (
    <div>
      <PlayerWithControls
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

      <div className="p-4">
        <CardTitle>{libraryVideo?.name ?? activeStream.name}</CardTitle>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Image
                className="rounded-full"
                width={50}
                height={50}
                alt={organization.name}
                src={organization.logo ?? '/UserEmptyIcon.png'}
              />
            </div>
            <div className="flex flex-col">
              <p className="font-medium">{organization.name}</p>
              <div className="text-muted-foreground flex items-center gap-1 text-[12px]">
                <p className="text-muted-foreground">
                  Created{' '}
                  {`${new Date(
                    libraryVideo?.createdAt ??
                      (activeStream.createdAt as string)
                  ).toUTCString()}`}{' '}
                  |{' '}
                </p>

                {libraryVideo?.playbackId ||
                  (activeStream?.streamSettings?.playbackId && (
                    <ViewCounts
                      className="text-muted-foreground"
                      playbackId={
                        libraryVideo?.playbackId ??
                        (activeStream?.streamSettings?.playbackId as string)
                      }
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EmbedButton
              playbackId={
                libraryVideo?.playbackId ??
                activeStream.streamSettings?.playbackId
              }
              playerName={libraryVideo?.name ?? activeStream?.name}
              vod={libraryVideo ? true : false}
            />
            <ShareButton
              shareFor={libraryVideo ? 'video' : 'livestream'}
              title={`Share ${libraryVideo ? 'video' : 'livestream'}`}
              className="bg-white"
            />
            {libraryVideo?.assetId && (
              <VideoDownload assetId={libraryVideo.assetId as string} />
            )}
            <ChannelShareIcons organization={organization} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPlayer;
