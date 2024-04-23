import { IExtendedSession } from '@/lib/types'
import VideoCardWithMenu from './VideoCard/VideoCardWithMenu'
import { Suspense } from 'react'
import {
  Card,
  CardHeader,
  CardDescription,
} from '@/components/ui/card'
export default async function VideoGrid({
  videos,
  OrganizationSlug,
  maxVideos,
  scroll,
}: {
  videos: IExtendedSession[]
  OrganizationSlug?: string
  maxVideos?: number
  scroll?: boolean
}) {
  if (!videos) return null

  return (
    <div className="bg-transparent border-none lg:w-full max-w-screen">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-2'
        }  lg:grid md:grid-cols-3 lg:grid-cols-3 gap-8 gap-x-4`}>
        {videos.map((video, index) =>
          ({ maxVideos }) && maxVideos && index > maxVideos ? null : (
            <div
              key={video._id}
              className={`${
                scroll && 'w-[300px]'
              } lg:w-full h-full border-none flex-initial`}>
              <Suspense
                fallback={
                  <Card
                    key={index}
                    className="border-none shadow-none">
                    <div className="min-h-full uppercase rounded-xl">
                      <div className="w-full animate-pulse bg-secondary aspect-video"></div>
                      <CardHeader className="px-2 mt-1 bg-white bg-opacity-10 rounded lg:p-0 lg:py-2">
                        <CardDescription className="flex flex-col space-y-2">
                          <div className="w-full h-5 animate-pulse bg-secondary" />
                          <div className="w-1/2 h-5 animate-pulse bg-secondary" />
                        </CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
                }>
                <VideoCardWithMenu
                  session={video}
                  link={`/${OrganizationSlug}/watch?session=${video._id.toString()}`}
                />
              </Suspense>
            </div>
          )
        )}
      </div>
    </div>
  )
}
