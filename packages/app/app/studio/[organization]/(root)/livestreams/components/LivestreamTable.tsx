import React from 'react';

import { CardDescription, CardTitle } from '@/components/ui/card';
import EmptyFolder from '@/lib/svg/EmptyFolder';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import SubscriptionAlert from './SubscriptionAlert';
import LivestreamTableCard from './LivestreamTableCard';

const LivestreamTable = async ({
  organizationId,
  fromDate,
  untilDate,
}: {
  organizationId: string;
  fromDate?: string;
  untilDate?: string;
}) => {
  let livestreams = await fetchOrganizationStages({
    organizationId: organizationId,
  });

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

    if (fromDate) {
      if (livestream.streamSettings?.isActive) {
        return true;
      }
      return streamDateOnly >= todayOnly;
    }
    if (untilDate) {
      return streamDateOnly < todayOnly;
    }
    return true;
  });

  if (livestreams.length === 0) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4 rounded-xl border bg-white">
        <EmptyFolder />
        <CardTitle className="text-2xl font-semibold">
          No livestreams found
        </CardTitle>
        <CardDescription>
          Create your first livestream to get started!
        </CardDescription>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <SubscriptionAlert />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {livestreams.map((livestream, index) => (
          <LivestreamTableCard stream={livestream} key={index} />
        ))}
      </div>
    </div>
  );
};

export default LivestreamTable;
