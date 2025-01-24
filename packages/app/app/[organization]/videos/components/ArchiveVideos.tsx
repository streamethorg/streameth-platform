import { fetchAllSessions } from '@/lib/services/sessionService';
import VideoGrid from '@/components/misc/Videos';
import { FileQuestion } from 'lucide-react';
import Pagination from '@/app/studio/[organization]/(root)/library/components/Pagination';

interface ArchiveVideosProps {
  organizationId?: string;
  organizationSlug?: string;
  searchQuery?: string;
  page?: number;
  gridLength: number;
}

const ArchiveVideos = async ({
  organizationId,
  organizationSlug,
  searchQuery,
  page,
  gridLength = 10,
}: ArchiveVideosProps) => {

  const { sessions: videos, pagination } = await fetchAllSessions({
    organizationId,
    limit: gridLength,
    onlyVideos: true,
    published: 'public',
    searchQuery,
    page,
    });


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
      <VideoGrid videos={videos} />
      {page && pagination.totalPages > 1 && <Pagination {...pagination} />}
    </>
  );
};

export default ArchiveVideos;
