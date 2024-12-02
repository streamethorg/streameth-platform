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
import Timezone from '@/lib/utils/timezone';

const DesktopButtons = ({
  name,
  description,
  date,
  video,
  nftCollection,
  vod,
  organizationSlug,
}: {
  name: string;
  description: string;
  date: string;
  video?: IExtendedSession | IExtendedStage;
  nftCollection: IExtendedNftCollections | null;
  vod: boolean;
  organizationSlug?: string;
}) => {
  return (
    <>
      {(video as IExtendedSession)?.nftCollections?.[0] && (
        <CollectVideButton
          video={video as IExtendedSession}
          nftCollection={nftCollection}
        />
      )}
      <div className="flex flex-row space-x-2">
        <ShareButton shareFor="video" />
        {(video as IExtendedSession)?.assetId && (
          <VideoDownloadClient
            variant="outline"
            videoName={`${video?.name}.mp4`}
            assetId={(video as IExtendedSession)?.assetId}
          />
        )}
      </div>
      {!vod && (
        <CalendarReminder
          eventName={name}
          description={description}
          start={date}
          end={date}
          organizationSlug={organizationSlug || ''}
          stageId={(video && '_id' in video && video._id) || ''}
        />
      )}
      {(video as IExtendedSession)?.transcripts?.chunks[0]?.text && (
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
  organizationSlug,
}: {
  name: string;
  description: string;
  date: string;
  video?: IExtendedSession | IExtendedStage;
  nftCollection: IExtendedNftCollections | null;
  vod: boolean;
  organizationSlug?: string;
}) => {
  const hasCalendarReminder = !vod;

  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      {(video as IExtendedSession)?.nftCollections?.[0] && (
        <CollectVideButton
          video={video as IExtendedSession}
          nftCollection={nftCollection}
        />
      )}
      <ShareButton
        variant={
          (video as IExtendedSession)?.nftCollections?.[0]
            ? 'outline'
            : 'primary'
        }
        shareFor="video"
      />
      {(video as IExtendedSession)?.assetId && (
        <VideoDownloadClient
          variant="outline"
          videoName={`${video?.name}.mp4`}
          assetId={(video as IExtendedSession)?.assetId}
        />
      )}
      {hasCalendarReminder && (
        <CalendarReminder
          eventName={name}
          description={description}
          start={date}
          end={date}
          organizationSlug={organizationSlug || ''}
          stageId={(video && '_id' in video && video._id) || ''}
        />
      )}
      {(video as IExtendedSession)?.transcripts?.chunks && (
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
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{name}</span>
        </CardTitle>
        <InfoBoxDescription speakers={speakers} description={description} />
        <div className="flex items-center space-x-2 text-sm">
          <Timezone date={date} video={video as IExtendedStage} />
          {playbackId && (
            <>
              <span className="font-bold">|</span>
              <ViewCounts playbackId={playbackId} />
            </>
          )}
        </div>
      </div>
      <>
        <div className="hidden justify-end items-center mt-0 mb-auto space-x-2 md:flex">
          <DesktopButtons
            name={name}
            description={description}
            date={date}
            video={video}
            nftCollection={nftCollection}
            vod={vod}
            organizationSlug={organizationSlug}
          />
        </div>
        <div className="flex justify-between items-center mt-2 mb-auto space-x-2 md:hidden">
          <MobileButtons
            name={name}
            description={description}
            date={date}
            video={video}
            nftCollection={nftCollection}
            vod={vod}
            organizationSlug={organizationSlug}
          />
        </div>
      </>
    </div>
  );
};

export default SessionInfoBox;
