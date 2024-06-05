'use server'

import { CardTitle } from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import {
  IExtendedNftCollections,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types'
import ShareButton from '../misc/interact/ShareButton'
import CollectVideButton from './CollectVideButton'
import { fetchNFTCollection } from '@/lib/services/nftCollectionService'
import { formatDate } from '@/lib/utils/time'
import ViewCounts from '@/app/[organization]/components/ViewCounts'
import CalendarReminder from '@/app/[organization]/livestream/components/CalendarReminder'
import { IExtendedSpeaker } from '@/lib/types'
import VideoDownload from '@/app/[organization]/components/VideoDownload'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import { EllipsisVertical } from 'lucide-react'
import VideoDownloadClient from '../misc/VideoDownloadClient'

const DesktopButtons = ({
  name,
  description,
  date,
  video,
  nftCollection,
  vod,
}: {
  name: string
  description: string
  date: string
  video?: IExtendedSession
  nftCollection: IExtendedNftCollections | null
  vod: boolean
}) => {
  return (
    <>
      {video?.nftCollections?.[0] && (
        <CollectVideButton
          video={video}
          nftCollection={nftCollection}
        />
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
    </>
  )
}

const MobileButtons = ({
  name,
  description,
  date,
  video,
  nftCollection,
  vod,
}: {
  name: string
  description: string
  date: string
  video?: IExtendedSession
  nftCollection: IExtendedNftCollections | null
  vod: boolean
}) => {
  return (
    <>
      {video?.nftCollections?.[0] ? (
        <>
          <div className="w-full">
            <CollectVideButton
              video={video}
              nftCollection={nftCollection}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <EllipsisVertical
                size={30}
                className="cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-2 w-full">
              {/* Hydration Error */}
              <ShareButton className="w-full" shareFor="video" />{' '}
              {video?.assetId && (
                <VideoDownloadClient
                  videoName={`${video.name}.mp4`}
                  assetId={video?.assetId}
                />
              )}
              {!vod && (
                <>
                  <CalendarReminder
                    eventName={name}
                    description={description}
                    start={date}
                    end={date}
                  />
                </>
              )}
            </PopoverContent>
          </Popover>
        </>
      ) : (
        <ShareButton variant={'primary'} shareFor="video" />
      )}
    </>
  )
}

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
  name: string
  description: string
  date: string
  speakers?: IExtendedSpeaker[]
  playbackId?: string
  inverted?: boolean
  vod?: boolean
  organizationSlug?: string
  viewCount?: boolean
  video?: IExtendedStage
}) => {
  const nftCollection = await fetchNFTCollection({
    collectionId: video?.nftCollections?.[0],
  })
  console.log('video', video)
  return (
    <div
      className={`flex flex-col md:flex-row py-4 md:space-x-2 ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{name}</span>
        </CardTitle>
        <InfoBoxDescription
          speakers={speakers}
          description={description}
        />
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
              : formatDate(
                  new Date(date),
                  'ddd. MMM. D, YYYY, h:mm a'
                )}
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
        <div className="hidden justify-end items-center mt-0 mb-auto space-x-2 md:flex">
          <DesktopButtons
            name={name}
            description={description}
            date={date}
            video={video}
            nftCollection={nftCollection}
            vod={vod}
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
          />
        </div>
      </>
    </div>
  )
}

export default SessionInfoBox
