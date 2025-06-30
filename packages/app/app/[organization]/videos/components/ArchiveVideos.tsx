import { fetchAllSessions } from "@/lib/services/sessionService";
import VideoGrid from "@/components/misc/Videos";
import { FileQuestion } from "lucide-react";
import Pagination from "@/app/studio/[organization]/(root)/library/components/Pagination";
import shuffleArray from "@/lib/utils/shuffleArray";

interface ArchiveVideosProps {
	organizationId?: string;
	organizationSlug?: string;
	searchQuery?: string;
	page?: number;
	gridLength: number;
}

const ArchiveVideos = async ({
	organizationId,
	searchQuery,
	page,
	gridLength = 10,
}: ArchiveVideosProps) => {
	const { sessions, pagination } = await fetchAllSessions({
		organizationId,
		limit: gridLength,
		onlyVideos: true,
		published: "public",
		searchQuery,
		page,
	});

	let shuffledSessions = shuffleArray(sessions);

	if (!searchQuery && sessions.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center mt-10 w-full h-full">
				<FileQuestion size={65} />
				<span className="mt-2 text-xl bolt">
					No videos have been uploaded yet
				</span>
			</div>
		);
	}

	if (searchQuery && sessions.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center mt-10 w-full h-full">
				<FileQuestion size={65} />
				<span className="mt-2 text-xl bolt">No videos have been found</span>
			</div>
		);
	}

	return (
		<>
			<VideoGrid videos={shuffledSessions} />
			{page && pagination.totalPages > 1 && <Pagination {...pagination} />}
		</>
	);
};

export default ArchiveVideos;
