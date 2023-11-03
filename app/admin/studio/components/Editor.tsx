'use client'

import { MediaControllerCallbackState, Player, useCreateClip, usePlaybackInfo } from '@livepeer/react'
import { useCallback, useMemo, useState } from 'react'

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
  const [message, setMessage] = useState('')
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>()
  const [startTime, setStartTime] = useState<PlaybackStartEnd | null>()
  const [endTime, setEndTime] = useState<PlaybackStartEnd | null>()

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

  const onError = useCallback((error: Error) => console.log(error), [])
  const onPlaybackStatusUpdate = useCallback((state: { progress: number; offset: number }) => setPlaybackStatus(state), [])
  const playbackStatusSelector = useCallback((state: MediaControllerCallbackState<HTMLMediaElement, never>) => ({
    progress: Number(state.progress.toFixed(1)),
    offset: Number(state.playbackOffsetMs?.toFixed(1) ?? 0),
  }), [])

  const { data: clipAsset, mutateAsync, isLoading } = useCreateClip({
    sessionId: props.sessionId,
    playbackId: props.playbackId,
    startTime: startTime?.unix ?? 0,
    endTime: endTime?.unix ?? 0,
  })

  const { data: clipPlaybackInfo } = usePlaybackInfo({
    playbackId: clipAsset?.playbackId ?? undefined,
    refetchInterval: (info) =>
      !info?.meta?.source?.some((s) => s.hrn === 'MP4') ? 2000 : false,
  })

  const mp4DownloadUrl = useMemo(() => {
    if (!clipPlaybackInfo) return null

    return clipPlaybackInfo?.meta?.source?.sort((a, b) => {
      const sizeA = a?.size ?? 0
      const sizeB = b?.size ?? 0

      return sizeB - sizeA;
    })?.find((s) => s.hrn === 'MP4')?.url ?? null
  }, [clipPlaybackInfo])

  return (
    <>
      <div className='w-full mt-8'>
        <Player
          {...playerProps}
          playRecording
          autoPlay
          playbackStatusSelector={playbackStatusSelector}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={onError}
          hlsConfig={hlsConfig}
        />

        <div className='flex flex-col mt-4'>
          <h2 className='text-xl'>Create Custom Clip</h2>

          {message && (
            <div className="bg-zinc-100 border border-zinc-400 text-zinc-700 rounded p-2 my-2" role="alert">
              {message}
            </div>
          )}

          <div className='flex flex-row w-full mt-4 gap-4'>
            <input
              name="start"
              type="number"
              value={startTime?.displayTime ?? ''}
              placeholder='Start time (in secs)'
              className='border border-1 p-2 max-w-[100px]'
              disabled />

            <button
              type='button'
              className="px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:shadow-none"
              onClick={() => {
                const progress = playbackStatus?.progress
                const offset = playbackStatus?.offset

                if (progress && offset) {
                  const calculatedTime = Date.now() - offset
                  setStartTime({ unix: calculatedTime, displayTime: progress.toFixed(0).toString() })
                }
              }}>
              Set Start
            </button>

            <input
              name="end"
              type="number"
              value={endTime?.displayTime ?? ''}
              placeholder='End time (in secs)'
              className='border border-1 p-2 max-w-[100px]'
              disabled
            />
            <button
              type='button'
              className="px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none"
              onClick={() => {
                const progress = playbackStatus?.progress
                const offset = playbackStatus?.offset

                if (progress && offset) {
                  const calculatedTime = Date.now() - offset
                  setEndTime({ unix: calculatedTime, displayTime: progress.toFixed(0).toString() })
                }
              }}>
              Set End
            </button>

            <button
              type='button'
              className="px-4 py-2 border bg-zinc-600 text-white focus:outline-none"
              onClick={() => {
                setStartTime(null)
                setEndTime(null)
                setMessage('This may take a while. Stay on the page to download it later or check back on Livepeer Studio.')
                mutateAsync()
              }}
              disabled={!startTime || !endTime || isLoading}>
              Create clip
            </button>

            <button type='button' onClick={() => {
              setStartTime(null)
              setEndTime(null)
              setMessage('')
            }}>
              Reset
            </button>

            {mp4DownloadUrl && (
              <button type='button'>
                <a target="_blank" rel="noopener noreferrer" href={mp4DownloadUrl ?? '#_'}>Download</a>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
