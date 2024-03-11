import ShareButton from '@/components/misc/interact/ShareButton'
import EmbedButton from '@/components/misc/interact/EmbedButton'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
import ViewCounts from '@/app/(vod)/watch/components/ViewCounts'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { IExtendedSpeaker } from '@/lib/types'
import Markdown from 'react-markdown'
// TODO LOADING STAT
const SessionInfoBox = ({
  title,
  cardDescription,
  description,
  playbackId,
  streamId,
  playerName,
  speakers,
  assetId,
  viewCount,
  inverted,
  avatarUrl,
  avatarFallback,
  vod = false,
}: {
  title: string
  cardDescription?: string
  description?: string
  playbackId?: string | undefined
  streamId?: string | undefined
  playerName: string
  speakers?: IExtendedSpeaker[]
  assetId?: string
  viewCount?: boolean
  inverted?: boolean
  avatarUrl?: string
  avatarFallback?: string
  vod?: boolean
}) => {
  return (
    <div
      className={`${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <CardHeader className="flex flex-col justify-between p-2 w-full lg:flex-row lg:items-center lg:p-2">
        <div className="flex-col md:flex">
          <CardTitle className="flex flex-row items-center space-x-2">
            {avatarUrl && (
              <Avatar>
                <AvatarImage src={avatarUrl} alt={avatarFallback} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            )}
            <span>{title}</span>
          </CardTitle>
          <CardDescription>
            {viewCount && playbackId && (
              <ViewCounts playbackId={playbackId} />
            )}
            <div
              className={`inverted && ${'text-white'} flex flex-row`}>
              {cardDescription}
            </div>
          </CardDescription>
        </div>
        <div className="flex flex-row my-0 ml-auto space-x-1">
          <ShareButton />
          <EmbedButton
            streamId={streamId}
            playbackId={playbackId}
            playerName={playerName}
            vod={vod}
          />
          {assetId && <VideoDownload assetId={assetId} />}
        </div>
      </CardHeader>
      <InfoBoxDescription
        description={description}
        speakers={speakers}
      />
    </div>
  )
}

export default SessionInfoBox
