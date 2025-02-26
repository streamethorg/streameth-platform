'use server';

import { fetchAllSessions } from '@/lib/services/sessionService';
import VideoGrid from '@/components/misc/Videos';
import { Suspense } from 'react';
import ArchiveVideoSkeleton from '../../livestream/components/ArchiveVideosSkeleton';
import { IExtendedSession } from '@/lib/types';

interface OrganizationVideosProps {
  organizationId: string;
  excludeSessionId?: string;
  limit?: number;
}

export default async function OrganizationVideos({
  organizationId,
  excludeSessionId,
  limit = 8,
}: OrganizationVideosProps) {
  // Fetch organization videos
  const { sessions } = await fetchAllSessions({
    organizationId,
    onlyVideos: true,
    published: 'true', // Only show public videos
    limit,
  });

  // Filter out the current video if excludeSessionId is provided
  const filteredSessions = excludeSessionId
    ? sessions.filter(
        (session) => session._id.toString() !== excludeSessionId
      )
    : sessions;

  if (!filteredSessions.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No other videos available
      </div>
    );
  }

  return (
    <Suspense fallback={<ArchiveVideoSkeleton />}>
      <VideoGrid videos={filteredSessions} />
    </Suspense>
  );
} 