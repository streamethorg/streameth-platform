import React from 'react';

import { CardDescription, CardTitle } from '@/components/ui/card';
import EmptyFolder from '@/lib/svg/EmptyFolder';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import SubscriptionAlert from './SubscriptionAlert';
import LivestreamTableCard from './LivestreamTableCard';
import { fetchOrganization } from '@/lib/services/organizationService';

const LivestreamTable = async ({
  organizationId,
  fromDate,
  untilDate,
}: {
  organizationId: string;
  fromDate?: string;
  untilDate?: string;
}) => {
  const streams = await fetchOrganizationStages({
    organizationId: organizationId,
    fromDate,
    untilDate,
  });

  if (streams.length === 0) {
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
        {streams.map((stream) => (
          <LivestreamTableCard stream={stream} />
        ))}
      </div>
    </div>
  );
};

export default LivestreamTable;
