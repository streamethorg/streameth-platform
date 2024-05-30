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
  const { setPlaybackStatus, playbackStatus, setStartTime, startTime, endTime, setEndTime } = useClipContext()
  const playbackRef = useRef<{ progress: number; offset: number }>({
    progress: 0,
    offset: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

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
  }, [src, setPlaybackStatus])

  useEffect(() => {
    if (videoRef.current && videoRef.current.duration && playbackStatus) {
      setEndTime({
        displayTime: videoRef.current.duration,
        unix: Date.now() - playbackStatus.offset,
      })
    }
  }, [videoRef.current?.duration])

  const handleMouseDown = (marker: string) => {
    setDragging(marker)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (dragging && videoRef.current && playbackStatus) {
      const rect = videoRef.current.getBoundingClientRect()
      const pos = ((event.clientX - rect.left) / rect.width) * videoRef.current.duration
      if (dragging === 'start') {
        if (pos >= 0 && pos < endTime.displayTime) {
          setStartTime({
            unix: Date.now() - playbackStatus.offset,
            displayTime: pos,
          })
          videoRef.current.currentTime = pos
        }
      } else if (dragging === 'end') {
        if (pos > startTime.displayTime && pos <= videoRef.current.duration) {
          setEndTime({
            unix: Date.now() - playbackStatus.offset,
            displayTime: pos,
          })
          
          videoRef.current.currentTime = pos
        }
      }
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, startTime, endTime])

  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100
    }
    return 0
  }


  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="relative mb-4">
        <video
          ref={videoRef}
          autoPlay={false}
          controls={true}
          className="w-full rounded-lg sticky top-0"
        ></video>
      </div>
      <div className="relative h-5 bg-gray-300 rounded-full">
        <div
          className="absolute h-5 bg-blue rounded-full"
          style={{
            left: `${getMarkerPosition(startTime.displayTime)}%`,
            right: `${100 - getMarkerPosition(endTime.displayTime)}%`,
          }}
        ></div>
        <div
          className="absolute top-[-5px] w-8 h-8 bg-green-500 rounded-full cursor-pointer"
          style={{
            left: `${getMarkerPosition(startTime.displayTime)}%`,
          }}
          onMouseDown={() => handleMouseDown('start')}
        ></div>
        <div
          className="absolute top-[-5px] w-8 h-8 bg-red-500 rounded-full cursor-pointer"
          style={{
            left: `${getMarkerPosition(endTime.displayTime)}%`,
          }}
          onMouseDown={() => handleMouseDown('end')}
        ></div>
      </div>
      <p>Clip Start: {startTime.displayTime.toFixed(2)} seconds</p>
      <p>Clip End: {endTime.displayTime.toFixed(2)} seconds</p>
    </div>
  )
}

export default ReactHlsPlayer
