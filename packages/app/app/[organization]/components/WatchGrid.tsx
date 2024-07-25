import { fetchAllSessions } from '@/lib/data';
import Link from 'next/link';
import VideoCardSkeleton from '@/components/misc/VideoCard/VideoCardSkeleton';
import Videos from '@/components/misc/Videos';
import { Video } from 'lucide-react';

const WatchGrid = async ({
  organizationSlug,
  gridLength = 4,
}: {
  organizationSlug: string;
  gridLength?: number;
}) => {
  const videos = (
    await fetchAllSessions({
      organizationSlug,
      onlyVideos: true,
      published: true,
      limit: gridLength,
    })
  ).sessions;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-xl font-bold">Watch More</h1>
        <Link href={`/${organizationSlug}/videos`}>
          {videos.length !== 0 && (
            <h3 className="text-sm hover:underline">See more videos</h3>
          )}
        </Link>
      </div>
      <Videos
        videos={videos}
        OrganizationSlug={organizationSlug}
        maxVideos={gridLength}
      />
      {videos.length === 0 && (
        <div className="flex flex-row items-center justify-center space-x-4 rounded-xl bg-secondary p-4">
          <Video size={20} />
          <p>No videos uploaded</p>
        </div>
      )}
    </div>
  );
};

export const WatchGridLoading = () => (
  <>
    <div className="flex items-center justify-between">
      <div className="h-6 w-1/4 rounded bg-gray-300"></div>
      <div className="h-4 w-1/5 rounded bg-gray-300"></div>
    </div>
    <div className="m-5 grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  </>
);

export default WatchGrid;
