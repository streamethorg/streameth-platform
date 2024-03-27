'use client'
import React, { useEffect, useRef } from 'react'
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

      const intervalId = setInterval(() => {
        if (videoRef.current) {
          const progress = videoRef.current.currentTime
          // Update progress without overwriting offset
          playbackRef.current.progress = progress
          setPlaybackStatus({ ...playbackRef.current })
        }
      }, 1000)

      // return () => {
      //   clearInterval(intervalId);
      //   if (Hls.isSupported() && videoRef.current) {
      //     // Optionally destroy Hls instance when the component unmounts
      //     const hlsInstance = Hls.getInstance(videoRef.current);
      //     if (hlsInstance) {
      //       hlsInstance.destroy();
      //     }
      //   }
      // };
    }
  }, [src, setPlaybackStatus])

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      controls
      style={{ width: '100%', height: 'auto' }}></video>
  )
}

export default ReactHlsPlayer
