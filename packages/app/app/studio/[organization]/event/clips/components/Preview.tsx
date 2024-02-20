'use client'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { Asset } from 'livepeer/dist/models/components'
import PlayerWithControls from '@/components/ui/Player'
import { Button } from '@/components/ui/button'

const Preview = ({
  playbackUrl,
  phase,
  progress,
}: {
  playbackUrl?: string
  phase?: string
  progress?: number
}) => {
  const { handleTermChange } = useSearchParams()
  return (
    <div>
      <PlayerWithControls
        src={[
          {
            src: playbackUrl as `${string}m3u8`,
            width: 1920,
            height: 1080,
            mime: 'application/vnd.apple.mpegurl',
            type: 'hls',
          },
        ]}
      />
      <div className="flex flex-row">
        <p>Clip status: {phase}</p>
        <p>Clip progress: {progress}</p>
        <Button
          onClick={() => {
            handleTermChange([
              {
                key: 'replaceAsset',
                value: 'true',
              },
            ])
          }}>
          Replace
        </Button>
      </div>
    </div>
  )
}

export default Preview
