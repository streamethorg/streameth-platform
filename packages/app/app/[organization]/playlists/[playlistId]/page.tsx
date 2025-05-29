import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPlaylist } from "@/lib/services/playlistService";
import { fetchOrganization } from "@/lib/services/organizationService";
import { fetchSession } from "@/lib/services/sessionService";
import { Suspense } from "react";
import PlaylistVideoPlayerSkeleton from "../components/PlaylistVideoPlayerSkeleton";
import OrganizationVideos from "../components/OrganizationVideos";
import { IExtendedSession } from "@/lib/types";
import PlaylistVideo from "../components/PlaylistVideo";

interface PlaylistProps {
	params: Promise<{ organization: string; playlistId: string }>;
	searchParams: Promise<{ video?: string }>;
}

export async function generateMetadata({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: PlaylistProps): Promise<Metadata> {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	const playlist = await fetchPlaylist({
		organizationId: params.organization,
		playlistId: params.playlistId,
	});
	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	let videoName = "";
	if (searchParams.video && playlist?.sessions?.length) {
		const video = await fetchSession({ session: searchParams.video });
		if (video) {
			videoName = video.name;
		}
	}

	return {
		title: videoName
			? `${videoName} - ${playlist?.name} - ${organization?.name}`
			: `${playlist?.name || "Playlist"} - ${organization?.name}`,
		description: playlist?.description,
		openGraph: {
			title: videoName
				? `${videoName} - ${playlist?.name} - ${organization?.name}`
				: `${playlist?.name} - ${organization?.name}`,
			description:
				playlist?.description ||
				`A collection of videos curated by ${organization?.name}`,
		},
	};
}

export default async function PlaylistPage({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: PlaylistProps) {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	const playlist = await fetchPlaylist({
		organizationId: params.organization,
		playlistId: params.playlistId,
	});
	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (!playlist || !organization) {
		return notFound();
	}

	// Fetch all sessions in the playlist
	const sessionPromises = playlist.sessions.map((sessionId) =>
		fetchSession({ session: sessionId.toString() }),
	);
	const allSessions = await Promise.all(sessionPromises);
	const sessions = allSessions.filter(
		(session): session is IExtendedSession => session !== null,
	);

	if (sessions.length === 0) {
		return (
			<div className="mx-auto space-y-4 w-full max-w-7xl md:p-4">
				<div className="px-4 space-y-4 md:px-0">
					<h1 className="text-3xl font-bold">{playlist.name}</h1>
					{playlist.description && (
						<p className="text-muted-foreground">{playlist.description}</p>
					)}
					<div className="flex justify-center items-center py-16 text-muted-foreground">
						This playlist has no videos
					</div>
				</div>
			</div>
		);
	}

	// Determine current video
	let currentVideo: IExtendedSession;
	if (searchParams.video) {
		// Try to find the specified video in the playlist
		const selectedVideo = sessions.find(
			(session) => session._id.toString() === searchParams.video,
		);

		// If found and it's in the playlist, use it
		if (selectedVideo) {
			currentVideo = selectedVideo;
		} else {
			// Fall back to first video if the specified one isn't found
			currentVideo = sessions[0];
		}
	} else {
		// No video specified, use the first one
		currentVideo = sessions[0];
	}

	console.log(
		"🎬 PlaylistPage: Will display current video:",
		currentVideo.name,
	);
	console.log(
		"🏢 PlaylistPage: Will render organization videos section with organizationId:",
		params.organization,
	);
	console.log(
		"🚫 PlaylistPage: Excluding sessionId from organization videos:",
		currentVideo._id.toString(),
	);

	return (
		<div className="mx-auto space-y-6 w-full max-w-7xl md:p-4">
			<div className="px-4 space-y-4 md:px-0">
				<h1 className="text-3xl font-bold">{playlist.name}</h1>
				{playlist.description && (
					<p className="text-muted-foreground">{playlist.description}</p>
				)}
				<Suspense
					key={searchParams.video}
					fallback={<PlaylistVideoPlayerSkeleton />}
				>
					<PlaylistVideo
						playlist={playlist}
						sessions={sessions}
						currentVideo={currentVideo}
						organizationName={organization.name}
						organizationLogo={organization.logo}
						organizationId={params.organization}
					/>
				</Suspense>

				<div className="mt-8">
					<h2 className="mb-4 text-2xl font-bold">
						More from {organization.name}
					</h2>
					<Suspense
						fallback={
							<div className="h-64 rounded-lg animate-pulse bg-muted"></div>
						}
					>
						<OrganizationVideos
							organizationId={params.organization}
							excludeSessionId={currentVideo._id.toString()}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
}

