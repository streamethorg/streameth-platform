import { Card } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { fetchAllSessions } from '@/lib/data'
import { fetchOrganization } from '@/lib/services/organizationService'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
import ChannelShareIcons from './ChannelShareIcons'
import { IExtendedSession } from '@/lib/types'
import ChannelVideoCard from './ChannelVideoCard'

function StreamTable({
  streams,
  tabValue,
  organizationSlug,
}: {
  tabValue: string
  streams: IExtendedSession[]
  organizationSlug?: string
}) {
  return (
    <TabsContent className="p-4" value={tabValue}>
      {streams.length === 0 && (
        <div className="mt-12 text-muted-foreground">
          This user doesn&apos;t have any {tabValue}.
        </div>
      )}

      <div className=" lg:w-full bg-transparent border-none ">
        <div className="lg:grid md:grid-cols-2 lg:grid-cols-4 gap-5 gap-x-4">
          {streams.map((stream) => (
            <div
              key={stream._id}
              className={`lg:w-full h-full border-none  flex-initial`}>
              <ChannelVideoCard
                organizationSlug={organizationSlug}
                session={stream}
                tab={tabValue}
              />
            </div>
          ))}
        </div>
      </div>
    </TabsContent>
  )
}

const Channel = async ({
  organizationSlug,
  playerActive,
  tab,
}: {
  organizationSlug: string
  playerActive?: boolean
  tab?: string
}) => {
  const organization = await fetchOrganization({ organizationSlug })
  if (!organization) return notFound()

  const videos = (
    await fetchAllSessions({
      organizationSlug: organizationSlug,
      onlyVideos: true,
    })
  ).sessions

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
        <Card className="pt-2 relative shadow-none bg-white">
          <div className="absolute right-0 mt-2 mr-4"></div>

          <Tabs defaultValue={tab ?? 'livestreams'}>
            <TabsList>
              <TabsTrigger value="livestreams">
                Livestreams
              </TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="search"></TabsTrigger>
            </TabsList>

            <StreamTable
              organizationSlug={organization.slug}
              streams={videos}
              tabValue="livestreams"
            />
            <StreamTable
              organizationSlug={organization.slug}
              streams={videos}
              tabValue="videos"
            />
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default Channel
