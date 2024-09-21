'use server';

import { CardTitle } from '@/components/ui/card';
import InfoBoxDescription from './InfoBoxDescription';
import {
  IExtendedNftCollections,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';
import ShareButton from '../misc/interact/ShareButton';
import CollectVideButton from './CollectVideButton';
import { fetchNFTCollection } from '@/lib/services/nftCollectionService';
import { formatDate } from '@/lib/utils/time';
import ViewCounts from '@/app/[organization]/components/ViewCounts';
import CalendarReminder from '@/app/[organization]/livestream/components/CalendarReminder';
import { IExtendedSpeaker } from '@/lib/types';
import VideoDownloadClient from '../misc/VideoDownloadClient';
import TranscriptionModal from './TranscriptionModal';

const DesktopButtons = ({
  name,
  description,
  date,
  video,
  nftCollection,
  vod,
}: {
  name: string;
  description: string;
  date: string;
  video?: IExtendedSession;
  nftCollection: IExtendedNftCollections | null;
  vod: boolean;
}) => {
  return (
    <>
      {video?.nftCollections?.[0] && (
        <CollectVideButton video={video} nftCollection={nftCollection} />
      )}
      <div className="flex flex-row space-x-2">
        <ShareButton shareFor="video" />
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
      {video?.transcripts?.chunks[0]?.text && (
        <TranscriptionModal video={video as IExtendedSession} />
      )}
    </>
  );
};

const MobileButtons = ({
  name,
  description,
  date,
  video,
  nftCollection,
  vod,
}: {
  name: string;
  description: string;
  date: string;
  video?: IExtendedSession;
  nftCollection: IExtendedNftCollections | null;
  vod: boolean;
}) => {
  const hasCalendarReminder = !vod;

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {video?.nftCollections?.[0] && (
        <CollectVideButton video={video} nftCollection={nftCollection} />
      )}
      <ShareButton
        variant={video?.nftCollections?.[0] ? 'outline' : 'primary'}
        shareFor="video"
      />
      {video?.assetId && (
        <VideoDownloadClient
          variant="outline"
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
  organizationSlug,
  viewCount = false,
  video,
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
}) => {
  const nftCollection = await fetchNFTCollection({
    collectionId: video?.nftCollections?.[0],
  });

  return (
    <div
      className={`flex flex-col py-4 md:flex-row md:space-x-2 ${
        inverted ? 'rounded-lg text-card-foreground text-white' : ''
      }`}
    >
      <div className="flex w-full flex-col justify-start">
        <CardTitle className="flex flex-row items-start justify-between text-xl lg:text-2xl">
          <span>{name}</span>
        </CardTitle>
        <InfoBoxDescription speakers={speakers} description={description} />
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {video?.isMultipleDate && video?.streamEndDate
              ? `${formatDate(
                  new Date(date),
                  'ddd. MMM. D, YYY, h:mm a'
                )} - ${formatDate(
                  new Date(video?.streamEndDate),
                  'ddd. MMM. D, YYYY, h:mm a'
                )}`
              : formatDate(new Date(date), 'ddd. MMM. D, YYYY, h:mm a')}
          </span>
          {playbackId && (
            <>
              <span className="font-bold">|</span>
              <ViewCounts playbackId={playbackId} />
            </>
          )}
        </div>
      </div>
      <>
        <div className="mb-auto mt-0 hidden items-center justify-end space-x-2 md:flex">
          <DesktopButtons
            name={name}
            description={description}
            date={date}
            video={video as IExtendedSession | undefined}
            nftCollection={nftCollection}
            vod={vod}
          />
        </div>
        <div className="mb-auto mt-2 flex items-center justify-between space-x-2 md:hidden">
          <MobileButtons
            name={name}
            description={description}
            date={date}
            video={video as IExtendedSession | undefined}
            nftCollection={nftCollection}
            vod={vod}
          />
        </div>
      </>
    </div>
  );
};

export default SessionInfoBox;
