'use server'

import { CardTitle } from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { IExtendedSession } from '@/lib/types'
import PopoverActions from '../misc/PopoverActions'
import ShareButton from '../misc/interact/ShareButton'
import CollectVideButton from './CollectVideButton'
import { fetchNFTCollection } from '@/lib/services/nftCollectionService'
import { formatDate } from '@/lib/utils/time'
import ViewCounts from '@/app/[organization]/components/ViewCounts'
import CalendarReminder from '@/app/[organization]/livestream/components/CalendarReminder'
import SpeakerIcon from '../speakers/speakerIcon'
import { IExtendedSpeaker } from '@/lib/types'

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
  video?: IExtendedSession
}) => {
  const nftCollection = await fetchNFTCollection({
    collectionId: video?.nftCollections?.[0],
  })
  return (
    <div
      className={`flex flex-col md:flex-row py-4 md:space-x-2  ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{name}</span>
        </CardTitle>
        <InfoBoxDescription description={description} />
        {speakers &&
          speakers.map((speaker) => (
            <SpeakerIcon key={speaker._id} speaker={speaker} />
          ))}
        <p className="flex items-center space-x-2 text-sm">
          <span>
            {formatDate(new Date(date), 'ddd. MMMM D, YYYY')}
          </span>
          {playbackId && (
            <>
              <span className="font-bold">|</span>
              <ViewCounts playbackId={playbackId} />
            </>
          )}
        </p>
      </div>
      <div className="flex justify-between items-center mt-2 mb-auto md:justify-end md:space-x-2">
        {video?.nftCollections?.[0] && (
          <CollectVideButton
            video={video}
            nftCollection={nftCollection}
          />
        )}
        {/* <ShareButton shareFor="video" /> */}
        {/* <PopoverActions
          organizationSlug={organizationSlug}
          session={video}
        /> */}
        {!playbackId && (
          <CalendarReminder
            eventName={name}
            description={description}
            start={date}
            end={date}
          />
        )}
      </div>
    </div>
  )
}

export default SessionInfoBox
