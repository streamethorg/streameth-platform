'use client'

import { MediaControllerCallbackState, Player, useCreateClip } from '@livepeer/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  playbackId: string
  sessionId?: string
}

const hlsConfig = {
  liveSyncDurationCount: Infinity
}

type PlaybackStatus = {
  progress: number
  offset: number
}

type PlaybackStartEnd = {
  displayTime: string
  unix: number
}

export function Editor(props: Props) {
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>()
  const [startTime, setStartTime] = useState<PlaybackStartEnd | null>()
  const [endTime, setEndTime] = useState<PlaybackStartEnd | null>()
  const timerRef = useRef(0)

  const playerProps = useMemo(() => {
    if (props.sessionId) {
      return {
        src: `${process.env.NEXT_PUBLIC_RECORDINGS_BASE_URL}${props.playbackId}/${props.sessionId}/output.m3u8`,
      }
    }

    return {
      playbackId: props.playbackId,
    }
  }, [props])

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const onError = useCallback((error: Error) => console.log(error), [])
  const onPlaybackStatusUpdate = useCallback((state: { progress: number; offset: number }) => setPlaybackStatus(state), [])
  const playbackStatusSelector = useCallback((state: MediaControllerCallbackState<HTMLMediaElement, never>) => ({
    progress: Number(state.progress.toFixed(1)),
    offset: Number(state.playbackOffsetMs?.toFixed(1) ?? 0),
  }), [])

  const { data: clipAsset, mutate, isLoading } = useCreateClip({
    sessionId: props.sessionId,
    playbackId: props.playbackId,
    startTime: startTime?.unix ?? 0,
    endTime: endTime?.unix ?? 0,
  })

  // const { data: clipPlaybackInfo } = usePlaybackInfo({
  //   playbackId: clipAsset?.playbackId ?? undefined,
  //   refetchInterval: (info) =>
  //     !info?.meta?.source?.some((s) => s.hrn === 'MP4') ? 2000 : false,
  // })

  return (
    <>
      <div style={{ margin: '16px 20px', maxWidth: 800, }}>
        <div>
          <Player
            {...playerProps}
            playRecording
            autoPlay
            muted
            playbackStatusSelector={playbackStatusSelector}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onError={onError}
            hlsConfig={hlsConfig}
          />
          <div>
            <button type='button' onClick={() => {
              const progress = playbackStatus?.progress;
              const offset = playbackStatus?.offset;

              if (progress && offset) {
                const calculatedTime = Date.now() - offset;

                if (!startTime) {
                  setStartTime({ unix: calculatedTime, displayTime: progress.toFixed(0).toString() })
                } else if (!endTime) {
                  setEndTime({ unix: calculatedTime, displayTime: progress.toFixed(0).toString() })
                } else {
                  setStartTime(null)
                  setEndTime(null)
                }
              }
            }}>
              {!startTime ? 'Set clip start time' : !endTime ? 'Set clip end time' : 'Reset'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', }}>
          <div style={{ flex: 1 }}>
            <span>Start time (seconds)</span>
            <input name="start" type="number" disabled value={startTime?.displayTime ?? ''} />
          </div>
          <div style={{ flex: 1 }}>
            <span>End time (seconds)</span>
            <input name="end" type="number" disabled value={endTime?.displayTime ?? ''} />
          </div>
        </div>

        <div style={{ float: 'right', marginTop: '10px' }}>
          <button type='button' onClick={mutate} disabled={!startTime || !endTime || isLoading}>
            Create clip
          </button>
        </div>
      </div>
    </>
  )
}
