'use server';

import { CardTitle } from '@/components/ui/card';
import InfoBoxDescription from './InfoBoxDescription';
import {
  IExtendedSession,
  IExtendedSpeaker,
  IExtendedStage,
} from '@/lib/types';
import ShareButton from '../misc/interact/ShareButton';
import ViewCounts from '@/app/[organization]/components/ViewCounts';
import CalendarReminder from '@/app/[organization]/livestream/components/CalendarReminder';
import VideoDownloadClient from '../misc/VideoDownloadClient';
import TranscriptionModal from './TranscriptionModal';
import Timezone from '@/lib/utils/timezone';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisVertical } from 'lucide-react';
import CollectVideButton from './CollectVideButton';

const DesktopButtons = ({
  name,
  description,
  date,
  video,
  vod,
  nftCollection,
}: {
  name: string;
  description: string;
  date: string;
  video?: IExtendedSession;
  vod: boolean;
  nftCollection?: IExtendedNftCollections;
}) => {
  console.log(video)
  return (
    <>
      <div className="flex flex-row space-x-2">
        <ShareButton shareFor="video" />
        <CollectVideButton video={video} nftCollection={nftCollection} />
        {video?.assetId && (
          <VideoDownloadClient
            variant="outline"
            videoName={`${video.name}.mp4`}
            assetId={video?.assetId}
          />
        )}
      </div>
      {!vod && (
        <CalendarReminder
          eventName={name}
          description={description}
          start={date}
          end={date}
        />
      )}
      <TranscriptionModal video={video as IExtendedSession} />
    </>
  );
};

const MobileButtons = ({
  name,
  description,
  date,
  video,
  vod,
}: {
  name: string;
  description: string;
  date: string;
  video?: IExtendedSession;
  vod: boolean;
}) => {
  const hasCalendarReminder = !vod;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={'ghost'}>
          <EllipsisVertical className="w-5 h-5 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex flex-col gap-2 items-center w-full">
          <ShareButton variant={'ghost'} shareFor="video" />
          {video?.assetId && (
            <VideoDownloadClient
              variant="ghost"
              videoName={`${video.name}.mp4`}
              assetId={video?.assetId}
            />
          )}
          {hasCalendarReminder && (
            <CalendarReminder
              eventName={name}
              description={description}
              start={date}
              end={date}
            />
          )}
          {video?.transcripts?.chunks && (
            <TranscriptionModal video={video as IExtendedSession} />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SessionInfoBox = async ({
  name,
  description,
  date,
  speakers,
  playbackId,
  inverted,
  vod = false,
  video,
  nftCollection,
}: {
  name: string;
  description: string;
  date: string;
  speakers?: IExtendedSpeaker[];
  playbackId?: string;
  inverted?: boolean;
  vod?: boolean;
  organizationSlug?: string;
  viewCount?: boolean;
  video?:
    | (IExtendedSession & { isMultipleDate?: boolean; streamEndDate?: string })
    | IExtendedStage;
  nftCollection?: IExtendedNftCollection;
}) => {
  return (
    <div
      className={`flex flex-col py-4 md:flex-row md:space-x-2 ${
        inverted ? 'rounded-lg text-card-foreground text-white' : ''
      }`}
    >
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-col justify-between items-start text-xl lg:text-2xl">
          <div className="flex flex-row justify-start items-center w-full">
            <p className="text-xl lg:text-2xl my-auto">{name}</p>
            <div className="md:hidden">
              <MobileButtons
                name={name}
                description={description}
                date={date}
                video={video as IExtendedSession | undefined}
                vod={vod}
                nftCollection={nftCollection}
              />
            </div>
            <div className="hidden justify-end items-center ml-auto space-x-2 md:flex">
              <DesktopButtons
                name={name}
                description={description}
                date={date}
                video={video as IExtendedSession | undefined}
                vod={vod}
                nftCollection={nftCollection}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            {playbackId && <ViewCounts playbackId={playbackId} />}
            <span>|</span>
            <Timezone date={date} video={video as IExtendedStage} />
          </div>
        </CardTitle>
        <InfoBoxDescription speakers={speakers} description={description} />
      </div>
    </div>
  );
};

export default SessionInfoBox;
