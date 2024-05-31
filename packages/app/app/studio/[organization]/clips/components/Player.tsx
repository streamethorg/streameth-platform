'use client'
import React, { useEffect, useRef, useState } from 'react'
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const { setPlaybackStatus } = useClipContext()
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

      // set error
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
    }
  }, [src, setPlaybackStatus])

  // if (error) {
  //   return (
  //     <div className=" aspect-video text-white bg-black flex flex-col items-center justify-center">
  //       <p>
  //         Clips can only be created for recordings that are less than
  //         7 days old
  //       </p>
  //     </div>
  //   )
  // }
  return (
    <video
      ref={videoRef}
      autoPlay={false}
      controls
      style={{
        borderRadius: '8px',
        width: '100%',
        height: 'auto',
        background: 'black',
      }}></video>
  )
}

export default ReactHlsPlayer
