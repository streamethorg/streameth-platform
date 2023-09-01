import React, { useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const DEFAULT_SKIP_TIME = 15

export function VideoPlayer(props: any) {
  useEventListener('keydown', onKeydown)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<any>(null)
  const playerRef = useRef<any>(null)
  const { options } = props

  useEffect(() => {
    // Only initialize player once
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        // Handle player events..
        // player.on('waiting', () => {
        //   videojs.log('player is waiting')
        // })

        // player.on('dispose', () => {
        //   videojs.log('player will dispose')
        // })

        player.on('timeupdate', () => {
          const currentTime = player.currentTime() ?? 0
          setDuration(Math.round(currentTime))
        })
      }))

      return
    }

    // Update an existing player properties when options change
    const player = playerRef.current
    player.src(options.sources)
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  function onKeydown(event: any) {
    const player: any = playerRef.current
    if (!player) return

    let time = player.currentTime()
    if (event.keyCode == 37) {
      event.preventDefault()
      time += -DEFAULT_SKIP_TIME
    }
    if (event.keyCode == 39) {
      event.preventDefault()
      time += DEFAULT_SKIP_TIME
    }
    if (time < 0) time = 0

    player.currentTime(time)
  }

  return (
    <>
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
      <p className="text-sm">Current time in seconds: {duration}</p>
    </>
  )
}
