'use client';
import Videos from '@/components/misc/Videos';
import { FileQuestion, VideoOff } from 'lucide-react';
import Pagination from './pagination';
import { useEffect, useState } from 'react';
import { IExtendedSession, IPagination } from '@/lib/types';
import { fetchAllSessions } from '@/lib/services/sessionService';
import ArchiveVideoSkeleton from '../../../[organization]/livestream/components/ArchiveVideosSkeleton';

const ArchiveVideos = ({
  organizationSlug,
  event,
  searchQuery,
  page,
}: {
  organizationSlug?: string;
  event?: string;
  searchQuery?: string;
  page?: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<IExtendedSession[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 0,
  });
  useEffect(() => {
    setIsLoading(true);
    fetchAllSessions({
      organizationSlug,
      event: event,
      limit: 12,
      onlyVideos: true,
      published: true,
      searchQuery,
      page: Number(page || 1),
    })
      .then((data) => {
        if (searchQuery && searchQuery !== currentSearchQuery) {
          setVideos(data.sessions);
          setCurrentSearchQuery(searchQuery);
        } else {
          setVideos([...videos, ...data.sessions]);
        }
        setPagination(data.pagination);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [organizationSlug, event, searchQuery, page]);

  if (Videos.length === 0) {
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
      {isLoading ? (
        <ArchiveVideoSkeleton />
      ) : (
        <Videos OrganizationSlug={organizationSlug} videos={videos} />
      )}
      <Pagination {...pagination} />
    </>
  );
};

export default ArchiveVideos;
