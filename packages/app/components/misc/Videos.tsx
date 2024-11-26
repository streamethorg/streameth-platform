'use client';

import type { IExtendedSession } from '@/lib/types';
import VideoCardWithMenu from './VideoCard/VideoCardWithMenu';
import { Suspense } from 'react';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';

export default function VideoGrid({
  videos,
  maxVideos,
  scroll,
}: {
  videos: IExtendedSession[];
  maxVideos?: number;
  scroll?: boolean;
}) {
  if (!videos) return null;

  return (
    <div className="bg-transparent border-none lg:w-full max-w-screen">
      <div
        className={`${
          scroll ? 'flex flex-row' : 'grid grid-cols-2'
        } gap-8 gap-x-4 md:grid-cols-4 lg:grid lg:grid-cols-4`}
      >
        {videos.map((video, index) =>
          typeof maxVideos === 'number' &&
          maxVideos > 0 &&
          index >= maxVideos ? null : (
            <div
              key={video._id}
              className={`${
                scroll && 'w-[300px]'
              } h-full flex-initial border-none lg:w-full`}
            >
              <Suspense
                fallback={
                  <Card key={video._id} className="border-none shadow-none">
                    <div className="min-h-full uppercase rounded-xl">
                      <div className="w-full animate-pulse aspect-video bg-secondary" />
                      <CardHeader className="px-2 mt-1 bg-white bg-opacity-10 rounded lg:p-0 lg:py-2">
                        <CardDescription className="flex flex-col space-y-2">
                          <div className="w-full h-5 animate-pulse bg-secondary" />
                          <div className="w-1/2 h-5 animate-pulse bg-secondary" />
                        </CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
                }
              >
                <VideoCardWithMenu
                  session={video}
                  link={`/${video.organizationId}/watch?session=${video._id.toString()}`}
                />
              </Suspense>
            </div>
          )
        )}
      </div>
    </div>
  );
}
