"use server";

import { Metadata, ResolvingMetadata } from "next";
import { fetchOrganization } from "@/lib/services/organizationService";
import { ChannelPageParams } from "@/lib/types";
import { Suspense } from "react";
import LiveStreams, { LiveStreamsLoading } from "./components/UpcomingStreams";
import { fetchOrganizationStages } from "@/lib/services/stageService";
import { livestreamMetadata, generalMetadata } from "@/lib/utils/metadata";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ArchiveVideos from "./videos/components/ArchiveVideos";
import ArchiveVideoSkeleton from "./livestream/components/ArchiveVideosSkeleton";
import ChannelBanner from "./components/ChannelBanner";
import ArchivePlaylists, {
	PlaylistSkeleton,
} from "./playlists/components/ArchivePlaylists";
import Player from "./livestream/components/Player";

const OrganizationHome = async ({
	params,
	searchParams,
}: ChannelPageParams) => {
	const streams = await fetchOrganizationStages({
		organizationId: params.organization,
	});
	const defaultTabValue = streams.length > 0 ? "livestreams" : "videos";

	const liveStream = streams.find(
		(stream) => stream.streamSettings?.isActive === true,
	);

	return (
		<div className="mx-auto space-y-4 w-full max-w-7xl md:p-4">
			{liveStream ? <Player stage={liveStream} /> : <ChannelBanner />}
			<Tabs defaultValue={defaultTabValue} className="w-full">
				<TabsList className="justify-start mb-2 w-full">
					<TabsTrigger value="livestreams">
						<h1 className="text-xl font-bold">Live</h1>
					</TabsTrigger>
					<TabsTrigger value="videos">
						<h1 className="text-xl font-bold">Videos</h1>
					</TabsTrigger>
					<TabsTrigger value="playlists">
						<h1 className="text-xl font-bold">Playlists</h1>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="livestreams" className="px-4 md:px-0">
					<Suspense fallback={<LiveStreamsLoading />}>
						<LiveStreams
							organizationId={params.organization}
							currentStreamId={searchParams.streamId}
						/>
					</Suspense>
				</TabsContent>
				<TabsContent value="videos" className="px-4 md:px-0">
					<Suspense fallback={<ArchiveVideoSkeleton />}>
						<ArchiveVideos
							organizationId={params.organization}
							organizationSlug={params.organization}
							searchQuery={searchParams.search}
							gridLength={12}
							page={Number(searchParams.page) || 1}
						/>
					</Suspense>
				</TabsContent>
				<TabsContent value="playlists" className="px-4 md:px-0">
					<Suspense fallback={<PlaylistSkeleton />}>
						<ArchivePlaylists
							organizationId={params.organization}
							gridLength={12}
						/>
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export async function generateMetadata(
	{ params }: ChannelPageParams,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	if (!params.organization) {
		return generalMetadata;
	}

	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (!organization) {
		return generalMetadata;
	}

	const allStreams = (
		await fetchOrganizationStages({
			organizationId: organization._id,
		})
	).filter((stream) => stream.published);

	const sortedStreams = allStreams.sort(
		(a, b) =>
			new Date(a.streamDate as string).getTime() -
			new Date(b.streamDate as string).getTime(),
	);

	const stage = sortedStreams.length > 0 ? sortedStreams[0] : null;

	if (!stage) {
		return generalMetadata;
	}

	return livestreamMetadata({
		livestream: stage,
		organization,
	});
}

export default OrganizationHome;
