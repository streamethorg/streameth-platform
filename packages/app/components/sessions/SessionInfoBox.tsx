'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardHeader,
} from '@/components/ui/card'

import ShareButton from '@/components/misc/ShareButton'
import EmbedButton from '@/components/misc/EmbedButton'
import SpeakerIcon from '../speakers/speakerIcon'
import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
import ViewCounts from '@/app/(vod)/watch/components/ViewCounts'
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

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
  const [isOpened, setIsOpened] = useState(false)
  const [isExpandable, setIsExpandable] = useState(false)
  const descriptionRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (descriptionRef.current) {
        const isMobile = window.innerWidth <= 768 // Adjust mobile breakpoint as needed
        const descriptionHeight = cardDescription?.length || 0
        setIsExpandable(isMobile && descriptionHeight < 100)
      }
    }

    // Check on mount and window resize
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
            {viewCount && assetId && <ViewCounts assetId={assetId} />}
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
        {/* <DropdownMenuWithActionButtons
          streamId={streamId}
          playbackId={playbackId}
          playerName={playerName}
          assetId={assetId}
        /> */}
      </CardHeader>
      {description !== '' && (
        <CardContent className="relative p-2 lg:p-2  border-t">
          <div
            ref={descriptionRef}
            className={`transition-max-height duration-700 ease-in-out overflow-hidden ${
              isExpandable && !isOpened && 'max-h-10'
            }`}>
            {description}
            <div className="flex flex-row mt-2 space-x-2">
              {speakers &&
                speakers.map((speaker) => (
                  <SpeakerIcon key={speaker._id} speaker={speaker} />
                ))}
            </div>
          </div>
          {isExpandable && (
            <button
              onClick={() => setIsOpened(!isOpened)}
              className="absolute ml-auto bottom-0 right-0 mr-2 text-primary">
              {isOpened ? (
                <ArrowUpWideNarrow />
              ) : (
                <ArrowDownWideNarrow />
              )}
            </button>
          )}
        </CardContent>
      )}
    </div>
  )
}

export default SessionInfoBox
