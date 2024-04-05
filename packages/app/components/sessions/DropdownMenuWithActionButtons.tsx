import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import VideoDownload from '@/app/(vod)/watch/components/VideoDownload'
import ShareButton from '@/components/misc/interact/ShareButton'
import EmbedButton from '@/components/misc/interact/EmbedButton'
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
        <MoreHorizontal className="flex p-2 w-10 h-10 rounded-full border md:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-none">
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
