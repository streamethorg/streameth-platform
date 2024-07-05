'use client'
import { cn } from '@/lib/utils/utils'
import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  SettingsIcon,
  UnmuteIcon,
} from '@livepeer/react/assets'
import * as Player from '@livepeer/react/player'
import * as Popover from '@radix-ui/react-popover'
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useRef, useEffect } from 'react'
// @ts-ignore
import mux from 'mux-embed'
import Image from 'next/image'
import { Src } from '@livepeer/react'
import LogoDark from '@/public/logo_dark.png'
import Link from 'next/link'

export function PlayerWithControls(props: {
  src: Src[] | null
  name?: string
  thumbnail?: string
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      const initTime = mux.utils.now()

      mux.monitor(videoRef.current, {
        debug: false,
        data: {
          env_key: '1lgdh87bv14j6bhv83buspkj3',
          player_name: 'Main Player',
          player_init_time: initTime,
          // Add other metadata fields here
        },
      })
    }
  }, [videoRef])

  if (!props.src || !props.src?.[0].src) {
    return (
      <PlayerLoading
        title="Invalid source"
        description="We could not fetch valid playback information for the playback ID you provided. Please check and try again."
      />
    )
  }

  return (
    <Player.Root src={props.src}>
      <Player.Container className="h-full w-full overflow-hidden bg-gradient-to-b from-[#FF9976] to-[#6426EF] outline-none transition md:rounded-xl">
        <Player.Video
          ref={videoRef}
          id={`player-${props.src[0].src}`}
          title={props.name ?? 'video'}
          className={cn('h-full w-full transition')}
        />
        {/* <Player.PlayingIndicator asChild matcher={false}>
          <div className="shadow border flex flex-col items-center justify-center bg-white rounded-xl h-[60px] absolute top-0 bottom-0 py-0 p-2 m-2">
            <span className="text-xs">Powered by</span>
            <Image
              src={LogoDark}
              width={140}
              height={60}
              className=""
              alt="StreamETH Logo"
            />
          </div>
        </Player.PlayingIndicator> */}
        <Player.PlayingIndicator asChild matcher={false}>
          {props.thumbnail && (
            <Image
              src={props.thumbnail}
              alt={props.name ?? 'image'}
              layout="fill"
            />
          )}
        </Player.PlayingIndicator>
        <Player.LoadingIndicator className="w-full relative h-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin" />
          </div>
          {props.thumbnail && (
            <Image
              src={props.thumbnail}
              alt={props.name ?? 'image'}
              layout="fill"
            />
          )}
          <PlayerLoading />
        </Player.LoadingIndicator>

        <Player.ErrorIndicator
          matcher="all"
          className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="h-8 w-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="offline"
          className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg animate-in fade-in-0 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-bold sm:text-2xl">
                Stream is offline
              </div>
              <div className="text-xs text-gray-100 sm:text-sm">
                Playback will start automatically once the stream has
                started
              </div>
            </div>
            <LoadingIcon className="mx-auto h-6 w-6 animate-spin md:h-8 md:w-8" />
          </div>
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="access-control"
          className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-bold sm:text-2xl">
                Stream is private
              </div>
              <div className="text-xs text-gray-100 sm:text-sm">
                It looks like you do not have permission to view this
                content
              </div>
            </div>
            <LoadingIcon className="mx-auto h-6 w-6 animate-spin md:h-8 md:w-8" />
          </div>
        </Player.ErrorIndicator>

        <Player.Controls className="flex flex-col-reverse gap-1 bg-gradient-to-b from-black/5 via-black/30 via-80% to-black/60 px-3 py-2 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 md:px-3">
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Player.PlayPauseTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                <Player.PlayingIndicator asChild matcher={false}>
                  <PlayIcon className="h-full w-full text-white" />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator asChild>
                  <PauseIcon className="h-full w-full text-white" />
                </Player.PlayingIndicator>
              </Player.PlayPauseTrigger>

              <Player.LiveIndicator className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-red-600 text-white" />
                <span className="select-none text-sm text-white">
                  LIVE
                </span>
              </Player.LiveIndicator>
              <Player.LiveIndicator
                matcher={false}
                className="flex items-center gap-2">
                <Player.Time className="select-none text-sm tabular-nums text-white" />
              </Player.LiveIndicator>

              <Player.MuteTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                <Player.VolumeIndicator asChild matcher={false}>
                  <MuteIcon className="h-full w-full text-white" />
                </Player.VolumeIndicator>
                <Player.VolumeIndicator asChild matcher={true}>
                  <UnmuteIcon className="h-full w-full text-white" />
                </Player.VolumeIndicator>
              </Player.MuteTrigger>
              <Player.Volume className="group relative mr-1 flex h-5 max-w-[120px] flex-1 cursor-pointer touch-none select-none items-center">
                <Player.Track className="relative h-[2px] grow rounded-full bg-white/30 transition group-hover:h-[3px] md:h-[3px] group-hover:md:h-[4px]">
                  <Player.Range className="absolute h-full rounded-full bg-white text-white" />
                </Player.Track>
                <Player.Thumb className="block h-3 w-3 rounded-full bg-white text-white transition group-hover:scale-110" />
              </Player.Volume>
            </div>

            <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
              <Link href={'https://streameth.org'} rel="noopener noreferrer" target="_blank">
                <div className="shadow border hidden md:flex flex-row items-center justify-center bg-white space-x-2 rounded-xl p-1">
              

                  <Image
                    src={LogoDark}
                    width={120}
                    height={23}
                    className=""
                    alt="StreamETH Logo"
                  />
                </div>
                <div className="shadow border flex md:hidden flex-row items-center justify-center bg-white space-x-2 p-[0.8px] rounded">
                  <Image
                    src={LogoDark}
                    width={80}
                    height={13}
                    className=""
                    alt="StreamETH Logo"
                  />
                </div>
              </Link>
              <Player.FullscreenIndicator matcher={false} asChild>
                <Settings className="h-6 w-6 flex-shrink-0 text-white transition" />
              </Player.FullscreenIndicator>
              {/* <Clip className="flex items-center w-6 h-6 justify-center" /> */}

              <Player.PictureInPictureTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                <PictureInPictureIcon className="h-full w-full text-white" />
              </Player.PictureInPictureTrigger>

              <Player.FullscreenTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                <Player.FullscreenIndicator asChild>
                  <ExitFullscreenIcon className="h-full w-full text-white" />
                </Player.FullscreenIndicator>

                <Player.FullscreenIndicator matcher={false} asChild>
                  <EnterFullscreenIcon className="h-full w-full text-white" />
                </Player.FullscreenIndicator>
              </Player.FullscreenTrigger>
            </div>
          </div>
          <Player.Seek className="group relative flex h-5 w-full cursor-pointer touch-none select-none items-center">
            <Player.Track className="relative h-[2px] grow rounded-full bg-white/30 transition group-hover:h-[3px] md:h-[3px] group-hover:md:h-[4px]">
              <Player.SeekBuffer className="absolute h-full rounded-full bg-black/30 transition duration-1000" />
              <Player.Range className="absolute h-full rounded-full bg-white" />
            </Player.Track>
            <Player.Thumb className="block h-3 w-3 rounded-full bg-white transition group-hover:scale-110" />
          </Player.Seek>
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  )
}

export default PlayerWithControls

export const PlayerLoading = ({
  title,
  description,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
}) => (
  <div className="relative flex aspect-video w-full flex-col-reverse gap-3 overflow-hidden rounded-sm bg-white/10 px-3 py-2">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-white/5" />
        <div className="h-6 w-16 animate-pulse overflow-hidden rounded-lg bg-white/5 md:h-7 md:w-20" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-white/5" />
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-white/5" />
      </div>
    </div>
    <div className="h-2 w-full animate-pulse overflow-hidden rounded-lg bg-white/5" />

    {title && (
      <div className="absolute inset-10 flex flex-col items-center justify-center gap-1 text-center">
        <span className="text-lg font-medium text-white">
          {title}
        </span>
        {description && (
          <span className="text-sm text-white/80">{description}</span>
        )}
      </div>
    )}
  </div>
)

// function Clip({ className }: { className?: string }) {
//   const [isPending, startTransition] = useTransition()

//   const createClipComposed = useCallback((opts: ClipPayload) => {
//     startTransition(async () => {
//       const result = await createClip(opts)

//       if (result.success) {
//         toast.success(
//           <span>
//             {
//               'You have created a new clip - in a few minutes, you will be able to view it at '
//             }
//             <a
//               href={`/?v=${result.playbackId}`}
//               target="_blank"
//               rel="noreferrer"
//               className="font-semibold">
//               this link
//             </a>
//             {'.'}
//           </span>
//         )
//       } else {
//         toast.error(
//           'Failed to create a clip. Please try again in a few seconds.'
//         )
//       }
//     })
//   }, [])

//   return (
//     <Player.LiveIndicator className={className} asChild>
//       <Player.ClipTrigger
//         onClip={createClipComposed}
//         disabled={isPending}
//         className="hover:scale-110 transition flex-shrink-0">
//         {isPending ? (
//           <LoadingIcon className="h-full w-full animate-spin" />
//         ) : (
//           <ClipIcon className="w-full h-full" />
//         )}
//       </Player.ClipTrigger>
//     </Player.LiveIndicator>
//   )
// }

export const Settings = React.forwardRef(function Search(
  { className }: { className?: string },
  ref: React.Ref<HTMLButtonElement> | undefined
) {
  return (
    <Popover.Root>
      <Popover.Trigger ref={ref} asChild>
        <button
          type="button"
          className={className}
          aria-label="Playback settings"
          onClick={(e) => {
            console.log(e)
            e.stopPropagation()
          }}>
          <SettingsIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-60 rounded-md border border-white/50 bg-black/50 p-3 text-white shadow-md outline-none backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          side="top"
          alignOffset={-70}
          align="end"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-sm font-medium text-white/90">
              Settings
            </p>
            <Player.LiveIndicator
              matcher={false}
              className="flex flex-col gap-2">
              <label
                className="text-xs font-medium text-white/90"
                htmlFor="speedSelect">
                Playback speed
              </label>
              <Player.RateSelect name="speedSelect">
                <Player.SelectTrigger
                  className="inline-flex h-7 items-center justify-between gap-1 rounded-sm px-1 text-xs leading-none outline-none outline-1 outline-white/50"
                  aria-label="Playback speed">
                  <Player.SelectValue placeholder="Select a speed..." />
                  <Player.SelectIcon>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Player.SelectIcon>
                </Player.SelectTrigger>
                <Player.SelectPortal>
                  <Player.SelectContent className="overflow-hidden rounded-sm border border-white/50 bg-white">
                    <Player.SelectViewport className="p-1">
                      <Player.SelectGroup>
                        <RateSelectItem value={0.5}>
                          0.5x
                        </RateSelectItem>
                        <RateSelectItem value={0.75}>
                          0.75x
                        </RateSelectItem>
                        <RateSelectItem value={1}>
                          1x (normal)
                        </RateSelectItem>
                        <RateSelectItem value={1.25}>
                          1.25x
                        </RateSelectItem>
                        <RateSelectItem value={1.5}>
                          1.5x
                        </RateSelectItem>
                        <RateSelectItem value={1.75}>
                          1.75x
                        </RateSelectItem>
                        <RateSelectItem value={2}>2x</RateSelectItem>
                      </Player.SelectGroup>
                    </Player.SelectViewport>
                  </Player.SelectContent>
                </Player.SelectPortal>
              </Player.RateSelect>
            </Player.LiveIndicator>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium text-white/90"
                htmlFor="qualitySelect">
                Quality
              </label>
              <Player.VideoQualitySelect
                name="qualitySelect"
                defaultValue="1.0">
                <Player.SelectTrigger
                  className="inline-flex h-7 items-center justify-between gap-1 rounded-sm px-1 text-xs leading-none outline-none outline-1 outline-white/50"
                  aria-label="Playback quality">
                  <Player.SelectValue placeholder="Select a quality..." />
                  <Player.SelectIcon>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Player.SelectIcon>
                </Player.SelectTrigger>
                <Player.SelectPortal>
                  <Player.SelectContent className="overflow-hidden rounded-sm bg-white">
                    <Player.SelectViewport className="p-[5px]">
                      <Player.SelectGroup>
                        <VideoQualitySelectItem value="auto">
                          Auto (HD+)
                        </VideoQualitySelectItem>
                        <VideoQualitySelectItem value="1080p">
                          1080p (HD)
                        </VideoQualitySelectItem>
                        <VideoQualitySelectItem value="720p">
                          720p
                        </VideoQualitySelectItem>
                        <VideoQualitySelectItem value="480p">
                          480p
                        </VideoQualitySelectItem>
                        <VideoQualitySelectItem value="360p">
                          360p
                        </VideoQualitySelectItem>
                      </Player.SelectGroup>
                    </Player.SelectViewport>
                  </Player.SelectContent>
                </Player.SelectPortal>
              </Player.VideoQualitySelect>
            </div>
          </div>
          <Popover.Close
            className="absolute right-2.5 top-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full outline-none"
            aria-label="Close">
            <XIcon />
          </Popover.Close>
          <Popover.Arrow className="fill-white/50" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
})

export const RateSelectItem = React.forwardRef<
  HTMLDivElement,
  Player.RateSelectItemProps
>(function RateSelectItem(
  { children, className, ...props },
  forwardedRef
) {
  return (
    <Player.RateSelectItem
      className={cn(
        'relative flex h-7 select-none items-center rounded-sm pl-[25px] pr-[35px] text-xs leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-white/20 data-[highlighted]:outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}>
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon className="h-4 w-4" />
      </Player.SelectItemIndicator>
    </Player.RateSelectItem>
  )
})

export const VideoQualitySelectItem = React.forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(function VideoQualitySelectItem(
  { children, className, ...props },
  forwardedRef
) {
  return (
    <Player.VideoQualitySelectItem
      className={cn(
        'relative flex h-7 select-none items-center rounded-sm pl-[25px] pr-[35px] text-xs leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-white/20 data-[highlighted]:outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}>
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon className="h-4 w-4" />
      </Player.SelectItemIndicator>
    </Player.VideoQualitySelectItem>
  )
})
