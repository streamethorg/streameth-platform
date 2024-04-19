'use server'

import {
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { IExtendedSession } from '@/lib/types'
import PopoverActions from '../misc/PopoverActions'
import ShareButton from '../misc/interact/ShareButton'
import CollectVideButton from './CollectVideButton'
import { fetchNFTCollection } from '@/lib/services/nftCollectionService'

const SessionInfoBox = async ({
  video,
  inverted,
  vod = false,
  organizationSlug,
}: {
  video: IExtendedSession
  inverted?: boolean
  vod?: boolean
  organizationSlug: string
}) => {
  const nftCollection = await fetchNFTCollection({
    collectionId: '6621bab63cd91449cc3554a8',
  }) //video.collectionId

  console.log(video.nftCollections[0])
  return (
    <div
      className={`flex flex-col md:flex-row py-4 md:space-x-2  ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full ">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{video.name}</span>
        </CardTitle>
        <InfoBoxDescription description={video.description} />
      </div>
      <div className="mb-auto flex justify-start items-center space-x-2 md:justify-end">
        {video.nftCollections[0] && (
          <CollectVideButton
            video={video}
            nftCollection={nftCollection}
          />
        )}

        <ShareButton shareFor="video" />
        <PopoverActions
          organizationSlug={organizationSlug}
          session={video}
        />
      </div>
    </div>
  )
}

export default SessionInfoBox
