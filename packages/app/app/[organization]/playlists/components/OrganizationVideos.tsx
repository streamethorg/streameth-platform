'use server';

import { fetchAllSessions } from '@/lib/services/sessionService';
import VideoGrid from '@/components/misc/Videos';
import { Suspense } from 'react';
import ArchiveVideoSkeleton from '../../livestream/components/ArchiveVideosSkeleton';

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
  console.log("🏢 OrganizationVideos: Fetching videos for organization", organizationId);
  console.log("🚫 OrganizationVideos: Excluding session", excludeSessionId);
  
  // Fetch organization videos
  const { sessions } = await fetchAllSessions({
    organizationId,
    onlyVideos: true,
    published: 'public', // Only show public videos
    limit,
  });
  
  console.log("📼 OrganizationVideos: Fetched", sessions.length, "videos");

  // Filter out the current video if excludeSessionId is provided
  const filteredSessions = excludeSessionId
    ? sessions.filter(
        (session) => session._id.toString() !== excludeSessionId
      )
    : sessions;
    
  console.log("🔍 OrganizationVideos: After filtering,", filteredSessions.length, "videos remain");

  if (!filteredSessions.length) {
    console.log("📭 OrganizationVideos: No videos to display after filtering");
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