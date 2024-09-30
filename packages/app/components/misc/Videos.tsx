'use client';
import { IExtendedSession } from '@/lib/types';
import VideoCardWithMenu from './VideoCard/VideoCardWithMenu';
import { Suspense } from 'react';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';

export default function VideoGrid({
  videos,
  OrganizationSlug,
  maxVideos,
  scroll,
}: {
  videos: IExtendedSession[];
  OrganizationSlug?: string;
  maxVideos?: number;
  scroll?: boolean;
}) {
  if (!videos) return null;

  return (
    <div className="max-w-screen border-none bg-transparent lg:w-full">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-2'
        } gap-8 gap-x-4 md:grid-cols-3 lg:grid lg:grid-cols-3`}
      >
        {videos.map((video, index) =>
          ({ maxVideos }) && maxVideos && index > maxVideos ? null : (
            <div
              key={video._id}
              className={`${
                scroll && 'w-[300px]'
              } h-full flex-initial border-none lg:w-full`}
            >
              <Suspense
                fallback={
                  <Card key={index} className="border-none shadow-none">
                    <div className="min-h-full rounded-xl uppercase">
                      <div className="aspect-video w-full animate-pulse bg-secondary"></div>
                      <CardHeader className="mt-1 rounded bg-white bg-opacity-10 px-2 lg:p-0 lg:py-2">
                        <CardDescription className="flex flex-col space-y-2">
                          <div className="h-5 w-full animate-pulse bg-secondary" />
                          <div className="h-5 w-1/2 animate-pulse bg-secondary" />
                        </CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
                }
              >
                <VideoCardWithMenu
                  session={video}
                  link={`/${OrganizationSlug || video.organizationId}/watch?session=${video._id.toString()}`}
                />
              </Suspense>
            </div>
          )
        )}
      </div>
    </div>
  );
}
