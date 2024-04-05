import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchAllSessions } from '@/lib/data'
import { fetchOrganization } from '@/lib/services/organizationService'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
import ChannelShareIcons from './ChannelShareIcons'
import { IExtendedSession } from '@/lib/types'
import ChannelSearchBar from './ChannelSearchBar'
import ChannelTabContentItem from './ChannelTabContentItem'

const Channel = async ({
  organizationSlug,
  playerActive,
  tab,
  searchVideos,
  searchQuery,
}: {
  organizationSlug: string
  playerActive?: boolean
  searchVideos: IExtendedSession[]
  tab?: string
  searchQuery?: string
}) => {
  const organization = await fetchOrganization({ organizationSlug })
  if (!organization) return notFound()

  const AllVideos = (
    await fetchAllSessions({
      organizationSlug: organizationSlug,
      onlyVideos: true,
    })
  ).sessions

  const livestreams = AllVideos.filter(
    (video) => video.type === 'livestream'
  )
  const videos = AllVideos.filter(
    (video) => video.type === 'clip' || video.type === 'video'
  )

  return (
    <div>
      <div className="flex flex-col gap-5">
        {!playerActive && (
          <Card className="overflow-hidden mt-4 shadow-none bg-white">
            <div className="w-full h-[250px] rounded-lg relative">
              <Image
                src="/backgrounds/channelBg.png"
                alt="channel bg"
                quality={100}
                fill
                className="w-full h-full rounded-lg object-cover"
                objectFit="cover"
              />
              <div className="w-[100px] h-[100px] bg-[#1E293B] rounded-[9999999px] border-2 border-white left-8 -bottom-11 absolute overflow-hidden">
                <Image
                  src={organization?.logo || '/UserEmptyIcon.png'}
                  alt="User"
                  quality={100}
                  fill
                  className="w-full h-full"
                  objectFit="cover"
                />
              </div>
            </div>

            <div className="mt-16 px-4 pb-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-medium text-2xl">
                    {organization?.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {organization?.bio}
                  </p>
                </div>
                <ChannelShareIcons organization={organization} />
              </div>
            </div>
          </Card>
        )}
        <Card className="pt-2 mx-4 lg:mx-0 relative shadow-none bg-white">
          <div className="absolute right-0 mt-2 mr-4"></div>

          <Tabs defaultValue={tab ?? 'livestreams'}>
            <TabsList className="border-b border-muted w-full !justify-start h-auto !pt-4 p-0">
              <TabsTrigger value="livestreams">
                Livestreams
              </TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger
                className="hidden"
                disabled
                value="search"></TabsTrigger>
              <ChannelSearchBar />
            </TabsList>

            <ChannelTabContentItem
              organizationSlug={organization.slug}
              streams={livestreams}
              tabValue="livestreams"
            />
            <ChannelTabContentItem
              organizationSlug={organization.slug}
              streams={videos}
              tabValue="videos"
            />

            <ChannelTabContentItem
              organizationSlug={organization.slug}
              streams={searchVideos}
              tabValue="search"
              searchQuery={searchQuery}
            />
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default Channel
