import { fetchAllSessions } from '@/lib/data';
import Videos from '@/components/misc/Videos';
import { FileQuestion } from 'lucide-react';
import Pagination from './pagination';

const ArchiveVideos = async ({
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
  const videos = await fetchAllSessions({
    organizationSlug,
    event: event,
    limit: 12,
    onlyVideos: true,
    published: true,
    searchQuery,
    page: Number(page || 1),
  });

  if (videos.pagination.totalItems === 0) {
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
      <Videos OrganizationSlug={organizationSlug} videos={videos.sessions} />
      <Pagination {...videos.pagination} />
    </>
  );
};

export default ArchiveVideos;
