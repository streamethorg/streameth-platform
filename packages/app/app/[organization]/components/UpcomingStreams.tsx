import { fetchStages } from '@/lib/services/stageService';
import LivestreamCard from '@/components/misc/VideoCard/LivestreamCard';
import React from 'react';
import { VideoCardSkeletonMobile } from '@/components/misc/VideoCard/VideoCardSkeleton';
import { Podcast } from 'lucide-react';

const UpcomingStreams = async ({
  organizationId,
  currentStreamId,
}: {
  organizationId: string;
  currentStreamId: string;
}) => {
  let livestreams = await fetchStages({
    organizationId,
  });

  console.log(livestreams);
  livestreams = livestreams.filter((livestream) => {
    // filter by streams in the future or happening today
    const streamDate = new Date(livestream.streamDate as string);
    const today = new Date();

    // Compare only the date parts (year, month, day)
    const streamDateOnly = new Date(
      streamDate.getFullYear(),
      streamDate.getMonth(),
      streamDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return livestream._id !== currentStreamId && streamDateOnly >= todayOnly;
  });

  // livestreams = livestreams.filter((livestream) => {
  //   return livestream.published;
  // });

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {livestreams.map((livestream) => (
          <React.Fragment key={livestream?._id?.toString()}>
            <div>
              <LivestreamCard
                livestream={livestream}
                name={livestream.name}
                date={livestream.streamDate as string}
                thumbnail={livestream.thumbnail ?? ''}
                link={`/${organizationId}/livestream?stage=${livestream?._id?.toString()}`}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
      {livestreams.length === 0 && (
        <div className="flex flex-row items-center justify-center space-x-4 rounded-xl bg-secondary p-4">
          <Podcast size={20} />
          <p>No scheduled livestreams</p>
        </div>
      )}
    </>
  );
};

export default UpcomingStreams;

export const UpcomingStreamsLoading = () => (
  <>
    <div className="h-6 w-1/4 rounded bg-gray-300 md:hidden"></div>
    <div className="m-5 grid grid-rows-3 gap-4 md:m-0 md:hidden md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="block md:hidden">
          <VideoCardSkeletonMobile />
        </div>
      ))}
    </div>
  </>
);
