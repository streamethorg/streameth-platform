import ShareButton from '@/components/misc/ShareButton'
import EmbedButton from '@/components/misc/EmbedButton'
import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
import ViewCounts from '@/app/(vod)/watch/components/ViewCounts'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
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
}: {
  title: string
  cardDescription?: string
  description?: string
  playbackId?: string | undefined
  streamId?: string | undefined
  playerName: string
  speakers?: ISpeaker[]
  assetId?: string
  viewCount?: boolean
  inverted?: boolean
  avatarUrl?: string
  avatarFallback?: string
}) => {
  return (
    <div
      className={`${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <CardHeader className=" p-2 lg:p-2 flex w-full lg:items-center justify-between flex-col lg:flex-row">
        <div className="md:flex flex-col">
          <CardTitle className="flex flex-row space-x-2 items-center">
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
        <div className="flex flex-row space-x-1 my-0 ml-auto">
          <ShareButton />
          <EmbedButton
            streamId={streamId}
            playbackId={playbackId}
            playerName={playerName}
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
