'use client'

import VideoJS from './VideoJs'
import 'video.js/dist/video-js.css'

interface Props {
  videoUrl: string
}

export function VideoPlayer(props: Props) {
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: props.videoUrl,
      },
    ],
  }

  return <VideoJS options={videoJsOptions} />
}
