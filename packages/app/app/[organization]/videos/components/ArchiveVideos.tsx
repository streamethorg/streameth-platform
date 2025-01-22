'use client';
import { IExtendedSession, IPagination } from '@/lib/types';
import { fetchAllSessions } from '@/lib/services/sessionService';
import VideoGrid from '@/components/misc/Videos';
import { useEffect, useState } from 'react';
import { FileQuestion, VideoOff } from 'lucide-react';
import Pagination from './pagination';
import { fetchOrganization } from '@/lib/services/organizationService';
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';

interface ArchiveVideosProps {
  organizationSlug?: string;
  event?: string;
  searchQuery?: string;
}

const ArchiveVideos = ({
  organizationSlug,
  event,
  searchQuery,
}: ArchiveVideosProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<IExtendedSession[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [currentEvent, setCurrentEvent] = useState('');

  const fetchSessions = async ({
    page = 1,
    reset,
  }: {
    page?: number;
    reset?: boolean;
  }) => {
    setIsLoading(true);
    try {
      let params: Parameters<typeof fetchAllSessions>[0] = {
        event,
        limit: 12,
        onlyVideos: true,
        published: 'public',
        searchQuery,
        page,
        itemStatus: ProcessingStatus.completed,
      };

      if (organizationSlug) {
        console.log('🎯 Fetching organization:', organizationSlug);
        const organization = await fetchOrganization({ organizationSlug });
        if (!organization) {
          console.error('❌ Organization not found');
          setIsLoading(false);
          return;
        }
        console.log('✅ Found organization:', organization._id);
        params = {
          ...params,
          organizationId: organization._id,
          organizationSlug,
        };
      }

      console.log('🎯 Fetching sessions with params:', params);

      const { sessions, pagination: newPagination } = await fetchAllSessions(params);

      console.log('✅ Fetched sessions:', {
        sessionsCount: sessions.length,
        pagination: newPagination,
      });

      if (reset) {
        setVideos(sessions);
      } else {
        setVideos([...videos, ...sessions]);
      }
      setPagination(newPagination);
    } catch (error) {
      console.error('❌ Failed to fetch sessions:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      if (error instanceof Response) {
        const text = await error.text();
        console.error('Response error:', text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery !== currentSearchQuery || event !== currentEvent) {
      setCurrentSearchQuery(searchQuery || '');
      setCurrentEvent(event || '');
      fetchSessions({ reset: true });
    }
  }, [searchQuery, event]);

  if (videos.length === 0) {
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
        <FileQuestion size={65} />
        <span className="bolt mt-2 text-xl">
          No videos have been uploaded yet
        </span>
      </div>
    );
  }

  return (
    <>
      <VideoGrid
        OrganizationSlug={organizationSlug}
        videos={videos}
      />
      <Pagination
        pagination={pagination}
        fetch={fetchSessions}
        isLoading={isLoading}
      />
    </>
  );
};

export default ArchiveVideos;
