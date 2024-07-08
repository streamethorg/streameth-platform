'use client'
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import Hls from 'hls.js'
import { useClipContext } from './ClipContext'

export interface HlsPlayerProps {
  playbackId: string
  selectedStreamSession: string
}

const ReactHlsPlayer: React.FC<HlsPlayerProps> = ({
  playbackId,
  selectedStreamSession,
}) => {
  const {
    setPlaybackStatus,
    setIsLoading,
    isLoading,
    videoRef,
    playbackStatus,
    setEndTime,
    endTime,
  } = useClipContext()

  const playbackRef = useRef<{ progress: number; offset: number }>({
    progress: 0,
    offset: 0,
  })

  const [error, setError] = useState<string | null>(null)

  const src = `https://link.storjshare.io/raw/juixm77hfsmhyslrxtycnqfmnlfq/catalyst-recordings-com/hls/${playbackId}/${selectedStreamSession}/output.m3u8`

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(videoRef.current)

      hls.on(Hls.Events.FRAG_CHANGED, (event, data) => {
        if (videoRef.current) {
          const progress = videoRef.current.currentTime
          const offset =
            Date.now() -
            (data.frag.rawProgramDateTime
              ? new Date(data.frag.rawProgramDateTime).getTime()
              : Date.now())
          playbackRef.current = { progress, offset }
          setPlaybackStatus(playbackRef.current)
        }
      })

      // if seeking loading spinner
      videoRef.current.onseeking = () => {
        setIsLoading(true)
      }

      // if not seeking hide loading spinner
      videoRef.current.onseeked = () => {
        setIsLoading(false)
      }

      // Set error handling
      hls.on(Hls.Events.ERROR, (event, data) => {
        setError(data.details)
      })

      const intervalId = setInterval(() => {
        if (videoRef.current) {
          const progress = videoRef.current.currentTime
          // Update progress without overwriting offset
          playbackRef.current.progress = progress
          setPlaybackStatus({ ...playbackRef.current })
        }
      }, 1000)

      return () => {
        hls.destroy()
        clearInterval(intervalId)
      }
    }
  }, [src, setPlaybackStatus, videoRef, setIsLoading])

  useEffect(() => {
    if (
      videoRef.current &&
      videoRef.current.duration &&
      playbackStatus &&
      endTime.unix === 0
    ) {
      setEndTime({
        displayTime: videoRef.current.duration,
        unix: Date.now() - playbackStatus.offset,
      })
    }
  }, [setEndTime, videoRef, playbackStatus])

  return (
    <div className="relative mb-4 flex h-2/3 flex-grow">
      <video
        ref={videoRef}
        autoPlay={false}
        controls={true}
        className="sticky top-0 w-full rounded-lg"></video>
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        {isLoading && (
          <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
        )}
      </div>
    </div>
  )
}

export default ReactHlsPlayer
