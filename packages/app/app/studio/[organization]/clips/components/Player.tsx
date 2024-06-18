'use client'
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import Hls from 'hls.js'
import { useClipContext } from './ClipContext'
import { ArrowLeftSquare, ArrowRightSquare } from 'lucide-react'
import { debounce } from 'lodash'

export interface HlsPlayerProps {
  playbackId: string
  selectedStreamSession: string
}

const debouncedUpdate = debounce(
  (callback: (data: any) => void, data: any) => {
    callback(data)
  },
  100
)

const ReactHlsPlayer: React.FC<HlsPlayerProps> = ({
  playbackId,
  selectedStreamSession,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    setPlaybackStatus,
    playbackStatus,
    setStartTime,
    startTime,
    endTime,
    setEndTime,
  } = useClipContext()
  const playbackRef = useRef<{ progress: number; offset: number }>({
    progress: 0,
    offset: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [initialMousePos, setInitialMousePos] = useState<number>(0)
  const [initialMarkerPos, setInitialMarkerPos] = useState<number>(0)
  const [selectedTooltip, setSelectedTooltip] = useState<
    string | null
  >(null)

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
    if (
      videoRef.current &&
      videoRef.current.duration &&
      playbackStatus
    ) {
      setEndTime({
        displayTime: videoRef.current.duration,
        unix: Date.now() - playbackStatus.offset,
      })
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.id === 'increment' || e.target.id === 'decrement')
      ) {
        return
      }

      if (selectedTooltip) {
        const tooltipElement =
          document.getElementById(selectedTooltip)
        if (
          tooltipElement &&
          !tooltipElement.contains(e.target as Node)
        ) {
          setSelectedTooltip(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedTooltip])

  const handle1SecondIncrementDecrement = useCallback(
    (increment: boolean, marker: string) => {
      if (videoRef.current && playbackStatus) {
        const time =
          marker === 'start'
            ? startTime.displayTime
            : endTime.displayTime
        const newTime = increment ? time + 1 : time - 1
        if (marker === 'start') {
          if (newTime >= 0 && newTime < endTime.displayTime) {
            debouncedUpdate(setStartTime, {
              unix: Date.now() - playbackStatus.offset,
              displayTime: newTime,
            })
          }
        } else if (marker === 'end') {
          if (
            newTime > startTime.displayTime &&
            newTime <= videoRef.current.duration
          ) {
            debouncedUpdate(setEndTime, {
              unix: Date.now() - playbackStatus.offset,
              displayTime: newTime,
            })
          }
        }
        videoRef.current.currentTime = newTime
      }
    },
    [
      videoRef.current,
      playbackStatus,
      startTime.displayTime,
      endTime.displayTime,
      debouncedUpdate,
      setStartTime,
      setEndTime,
    ]
  )

  const handleMouseDown = (
    marker: string,
    event: React.MouseEvent
  ) => {
    setDragging(marker)
    setSelectedTooltip(marker)

    setInitialMousePos(event.clientX)
    setInitialMarkerPos(
      marker === 'start' ? startTime.displayTime : endTime.displayTime
    )
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragging && videoRef.current && playbackStatus) {
        const rect = videoRef.current.getBoundingClientRect()
        const mouseDelta = event.clientX - initialMousePos
        const pos =
          initialMarkerPos +
          (mouseDelta / rect.width) * videoRef.current.duration
        videoRef.current.currentTime = pos
        if (dragging === 'start') {
          if (pos >= 0 && pos < endTime.displayTime) {
            setStartTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: pos,
            })
          }
        } else if (dragging === 'end') {
          if (
            pos > startTime.displayTime &&
            pos <= videoRef.current.duration
          ) {
            setEndTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: pos,
            })
          }
        }
      }
    },
    [
      dragging,
      initialMousePos,
      initialMarkerPos,
      endTime.displayTime,
      startTime.displayTime,
      playbackStatus,
    ]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousedown', (e) => {
      e.preventDefault()
    })

    window.addEventListener('keydown', (e) => {
      if (selectedTooltip) {
        e.preventDefault()
        if (e.key === 'ArrowRight') {
          handle1SecondIncrementDecrement(true, selectedTooltip)
        } else if (e.key === 'ArrowLeft') {
          handle1SecondIncrementDecrement(false, selectedTooltip)
        }
      }

      if (e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play()
          } else {
            videoRef.current.pause()
          }
        }
      }
    })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    handle1SecondIncrementDecrement,
    handleMouseMove,
    handleMouseUp,
    selectedTooltip,
  ])

  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100
    }
    return 0
  }

  const generateTimeStamps = (duration: number): number[] => {
    // Generate an array of timestamps in the form 0:30:00 for the duration.
    // One timestamp per 30 min
    const timestamps = []
    for (let i = 0; i < duration; i += 1800) {
      const hours = Math.floor(i / 3600)
      const minutes = Math.floor((i % 3600) / 60)
      const seconds = i % 60
      timestamps.push(i)
    }
    return timestamps
  }

  const handleSeek = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds) return '00:00:00'

    const date = new Date(0)
    date.setSeconds(seconds)
    return date.toISOString().substr(11, 8)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="relative mb-4">
        <video
          ref={videoRef}
          autoPlay={false}
          controls={false}
          className="w-full rounded-lg sticky top-0"></video>
      </div>
      <div className="flex flex-row w-full justify-center items-center mb-4">
        <button onClick={() => videoRef.current?.play()}>Play</button>
        <button onClick={() => videoRef.current?.pause()}>
          Pause
        </button>
        <label>
          Speed:
          <select
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.playbackRate = parseFloat(
                  e.target.value
                )
              }
            }}>
            <option value="0.5">0.5x</option>
            <option value="1" selected>
              1x
            </option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>
        <span>
          {videoRef.current
            ? formatTime(videoRef.current.currentTime)
            : '00:00:00'}
          /{' '}
          {videoRef.current
            ? formatTime(videoRef.current.duration)
            : '00:00:00'}
        </span>
      </div>
      <div className="p-4">
        <div className="h-5 mb-4 relative" onClick={handleSeek}>
          {videoRef.current &&
            videoRef.current.duration &&
            generateTimeStamps(videoRef.current.duration).map(
              (time) => {
                if (!videoRef || !videoRef.current) return 0
                return (
                  <div
                    key={time}
                    className={`absolute flex flex-col `}
                    style={{
                      left: `${
                        (time / videoRef.current.duration) * 100
                      }%`,
                    }}>
                    <p
                      className={`text-xs ${
                        time !== 0 && 'ml-[-25px]'
                      }`}>
                      {new Date(time * 1000)
                        .toISOString()
                        .substr(11, 8)}
                    </p>
                    <div
                      className={`h-2 w-[1px] bg-black ${
                        time !== 0 && 'ml-[-0.5px]'
                      }`}
                    />
                  </div>
                )
              }
            )}
        </div>
        <div className="relative flex h-10  rounded-full">
          <div className="bg-gray-400 my-auto h-2 w-full rounded-xl " />
          <div
            className="absolute h-10 border-2 border-primary flex rounded-xl"
            style={{
              left: `${getMarkerPosition(startTime.displayTime)}%`,
              right: `${
                100 - getMarkerPosition(endTime.displayTime)
              }%`,
            }}>
            {/* {videoRef.current && !dragging && (
              <div
                className="h-20 w-[3px] absolute bg-black top-[-10px]"
                style={{
                  left: `${
                    (videoRef.current.currentTime /
                      videoRef.current.duration) *
                    100
                  }%`,
                }}></div>
            )} */}
            <div className="bg-gray-200 my-auto h-2 w-full " />
          </div>
          <Marker
            {...{
              startTime,
              endTime,
              handleMouseDown,
              getMarkerPosition,
              formatTime,
              marker: 'start',
              setSelectedTooltip,
              selectedTooltip,
              handle1SecondIncrementDecrement,
            }}
          />
          <Marker
            {...{
              startTime,
              endTime,
              handleMouseDown,
              getMarkerPosition,
              formatTime,
              marker: 'end',
              setSelectedTooltip,
              selectedTooltip,
              handle1SecondIncrementDecrement,
            }}
          />
        </div>
        <p>Clip Start: {startTime.displayTime.toFixed(2)} seconds</p>
        <p>Clip End: {endTime.displayTime.toFixed(2)} seconds</p>
      </div>
    </div>
  )
}

export default ReactHlsPlayer

const Marker = ({
  startTime,
  endTime,
  handleMouseDown,
  getMarkerPosition,
  formatTime,
  marker,
  selectedTooltip,
}: {
  startTime: { displayTime: number; unix: number }
  endTime: { displayTime: number; unix: number }
  handleMouseDown: (marker: string, event: React.MouseEvent) => void
  getMarkerPosition: (time: number) => number
  formatTime: (seconds: number) => string
  selectedTooltip: string | null
  marker: string
  handle1SecondIncrementDecrement: (
    increment: boolean,
    marker: string
  ) => void
}) => {
  return (
    <div
      className={`absolute w-[15px] h-full `}
      style={{
        left: `${getMarkerPosition(
          marker === 'start'
            ? startTime.displayTime
            : endTime.displayTime
        )}%`,
      }}
      onMouseDown={(e) => {
        handleMouseDown(marker, e)
      }}>
      <div className="relative h-full w-full">
        <div
          id={marker}
          className={`bg-opacity-10 h-full bg-primary cursor-pointer ${
            marker !== 'start'
              ? 'translate-x-[-100%] rounded-r-xl'
              : 'rounded-l-xl '
          } `}
        />
        {selectedTooltip === marker && (
          <div className="absolute top-[-50px] left-[-55px] p-1 text-white bg-primary text-xs rounded-xl flex justify-center items-center flex-col">
            <p className="flex flex-row w-[120px] space-x-1 items-center justify-center">
              <span>Use</span>{' '}
              <ArrowLeftSquare width={15} height={15} />
              <ArrowRightSquare width={15} height={15} />{' '}
              <span>to trim</span>
            </p>
            {formatTime(
              marker === 'start'
                ? startTime.displayTime
                : endTime.displayTime
            )}
          </div>
        )}
      </div>
    </div>
  )
}
