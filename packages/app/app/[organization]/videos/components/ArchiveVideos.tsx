'use client';
import Videos from '@/components/misc/Videos';
import { FileQuestion, VideoOff } from 'lucide-react';
import Pagination from './pagination';
import { useEffect, useState } from 'react';
import { IExtendedSession, IPagination } from '@/lib/types';
import { fetchAllSessions } from '@/lib/services/sessionService';

const ArchiveVideos = ({
  organizationSlug,
  event,
  searchQuery,
}: {
  organizationSlug?: string;
  event?: string;
  searchQuery?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<IExtendedSession[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const fetchSessions = ({
    page = 1,
    reset,
  }: {
    page?: number;
    reset?: boolean;
  }) => {
    setIsLoading(true);
    fetchAllSessions({
      organizationSlug,
      event: event,
      limit: 12,
      onlyVideos: true,
      published: true,
      searchQuery,
      page,
    })
      .then((data) => {
        if (reset) {
          setVideos(data.sessions);
        } else {
          setVideos([...videos, ...data.sessions]);
        }
        setPagination(data.pagination);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSessions({
      page: 1,
      reset: searchQuery !== currentSearchQuery,
    });
    if (searchQuery && searchQuery !== currentSearchQuery) {
      setCurrentSearchQuery(searchQuery);
    }
  }, [searchQuery]);

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
      <Videos OrganizationSlug={organizationSlug} videos={videos} />
      <Pagination
        fetch={fetchSessions}
        pagination={pagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default ArchiveVideos;
