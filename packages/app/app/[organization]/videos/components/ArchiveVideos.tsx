'use client';

import Videos from '@/components/misc/Videos';
import { FileQuestion } from 'lucide-react';
import Pagination from './pagination';
import { useEffect, useState } from 'react';
import { IExtendedSession, IPagination } from '@/lib/types';
import { fetchAllSessions } from '@/lib/services/sessionService';

const ArchiveVideos = ({
  organizationId,
  event,
  searchQuery,
}: {
  organizationId?: string;
  event?: string;
  searchQuery?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<IExtendedSession[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [currentEvent, setCurrentEvent] = useState('');

  const fetchSessions = ({
    page = 1,
    reset,
  }: {
    page?: number;
    reset?: boolean;
  }) => {
    setIsLoading(true);
    fetchAllSessions({
      organizationId,
      event: event,
      limit: 12,
      onlyVideos: true,
      published: 'public',
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
      reset: searchQuery !== currentSearchQuery || event !== currentEvent,
    });

    if (searchQuery && searchQuery !== currentSearchQuery) {
      setCurrentSearchQuery(searchQuery);
    }
    if (event && event !== currentEvent) {
      setCurrentEvent(event);
    }
  }, [searchQuery, event]);

  if (Videos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-10 w-full h-full">
        <FileQuestion size={65} />
        <span className="mt-2 text-xl bolt">
          No videos have been uploaded yet
        </span>
      </div>
    );
  }

  return (
    <>
      <Videos videos={videos} />
      <Pagination
        fetch={fetchSessions}
        pagination={pagination}
        isLoading={isLoading}
      />
    </>
  );
};

export default ArchiveVideos;
