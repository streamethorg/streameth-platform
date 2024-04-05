import React from 'react'

import { TabsContent } from '@/components/ui/tabs'
import { IExtendedSession } from '@/lib/types'
import VideoCardWithMenu from '@/components/misc/VideoCard/VideoCardWithMenu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import ShareVideoMenuItem from './ShareVideoMenuItem'

const ChannelTabContentItem = ({
  streams,
  tabValue,
  organizationSlug,
  searchQuery,
}: {
  tabValue: string
  streams: IExtendedSession[]
  organizationSlug?: string
  searchQuery?: string
}) => {
  return (
    <TabsContent className="p-4" value={tabValue}>
      {streams.length === 0 && tabValue == 'search' && (
        <div className="mt-12 text-muted-foreground">
          This channel has no content that matched &apos;{searchQuery}
          &apos;
        </div>
      )}
      {streams.length === 0 && tabValue !== 'search' && (
        <div className="mt-12 text-muted-foreground">
          This channel doesn&apos;t have any {tabValue}.
        </div>
      )}

      <div className=" lg:w-full bg-transparent ">
        <div className="lg:grid md:grid-cols-2 lg:grid-cols-4 gap-5 gap-x-4">
          {streams.map((stream) => (
            <div
              key={stream._id}
              className={`lg:w-full h-full border-none  flex-initial`}>
              <VideoCardWithMenu
                session={stream}
                link={`/${organizationSlug}?tab=${tabValue}&playbackId=${stream._id}`}
                DropdownMenuItems={
                  <>
                    <DropdownMenuItem>
                      <ShareVideoMenuItem
                        url={`/${organizationSlug}?tab=${tabValue}&playbackId=${stream._id}`}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button variant="ghost">
                        <Download className="w-5 h-5 pr-1" /> Download
                      </Button>
                    </DropdownMenuItem>
                  </>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </TabsContent>
  )
}

export default ChannelTabContentItem
