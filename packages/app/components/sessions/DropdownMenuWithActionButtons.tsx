import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
import ShareButton from '@/components/misc/ShareButton'
import EmbedButton from '@/components/misc/EmbedButton'
import { MoreHorizontal } from 'lucide-react'
export function DropdownMenuWithActionButtons({
  streamId,
  playbackId,
  playerName,
  assetId,
}: {
  streamId?: string
  playbackId?: string
  playerName: string
  assetId?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="flex md:hidden border rounded-full w-10 h-10 p-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-none ">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <div className="w-full">
              <ShareButton />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div className="w-full">
              <EmbedButton
                streamId={streamId}
                playbackId={playbackId}
                playerName={playerName}
              />
            </div>
          </DropdownMenuItem>
          {assetId && (
            <DropdownMenuItem asChild>
              <div>
                <VideoDownload assetId={assetId} />
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuWithActionButtons
