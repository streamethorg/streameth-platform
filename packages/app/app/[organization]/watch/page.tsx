import { PlayerWithControls } from "@/components/ui/Player";
import SessionInfoBox from "@/components/sessions/SessionInfoBox";
import { IExtendedSession, OrganizationPageProps } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generalMetadata, watchMetadata } from "@/lib/utils/metadata";
import { fetchSession } from "@/lib/services/sessionService";
import { fetchOrganization } from "@/lib/services/organizationService";
import { Suspense } from "react";
import { getVideoUrlAction } from "@/lib/actions/livepeer";
import { generateThumbnailAction } from "@/lib/actions/sessions";
import Link from "next/link";
import ArchiveVideos from "../videos/components/ArchiveVideos";
import ArchiveVideoSkeleton from "../livestream/components/ArchiveVideosSkeleton";

const Loading = () => {
	return (
		<div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full animate-pulse">
			<div className="flex flex-col w-full h-full md:p-4">
				<div className="w-full bg-gray-300 aspect-video"></div>
				<div className="px-4 mt-4 space-y-2 w-full md:px-0">
					<div className="w-3/4 h-6 bg-gray-200 rounded"></div>
					<div className="w-full h-4 bg-gray-200 rounded"></div>
					<div className="w-1/4 h-4 bg-gray-200 rounded"></div>
				</div>
			</div>
			<div className="px-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
					<div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
					<div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
					<div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
				</div>
			</div>
		</div>
	);
};

export default async function Watch({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: OrganizationPageProps) {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	if (!searchParams.session) return notFound();

	const session = await fetchSession({
		session: searchParams.session,
	});

	if (!session?.playbackId) return notFound();

	const videoUrl = await getVideoUrlAction(session);
	if (!videoUrl) return notFound();

	return (
		<Suspense key={session._id} fallback={<Loading />}>
			<div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full">
				<div className="flex flex-col w-full h-full md:p-4">
					<PlayerWithControls
						name={session.name}
						thumbnail={session.coverImage}
						caption={session?.transcripts?.subtitleUrl}
						src={[
							{
								src: videoUrl as `${string}m3u8`,
								width: 1920,
								height: 1080,
								mime: "application/vnd.apple.mpegurl",
								type: "hls",
							},
						]}
					/>
					<div className="px-4 w-full md:px-0">
						<SessionInfoBox
							name={session.name}
							description={session.description ?? "No description"}
							speakers={session.speakers}
							date={session.createdAt as string}
							playbackId={session.playbackId}
							organizationSlug={params.organization}
							vod={true}
							video={session as IExtendedSession}
						/>
					</div>
				</div>
				<div className="px-4">
					<div className="flex justify-between items-center pb-4">
						<h1 className="text-2xl font-bold">More videos</h1>
						<Link href={`/${params.organization}`}>
							<h3 className="text-sm hover:underline">See more videos</h3>
						</Link>
					</div>
					<div className="md:hidden">
						<Suspense fallback={<ArchiveVideoSkeleton />}>
							<ArchiveVideos
								organizationId={params.organization}
								organizationSlug={params.organization}
								gridLength={4}
							/>
						</Suspense>
					</div>
					<div className="hidden md:block">
						<Suspense fallback={<ArchiveVideoSkeleton />}>
							<ArchiveVideos
								organizationId={params.organization}
								organizationSlug={params.organization}
								gridLength={8}
							/>
						</Suspense>
					</div>
				</div>
			</div>
		</Suspense>
	);
}

export async function generateMetadata({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: OrganizationPageProps): Promise<Metadata> {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	if (!searchParams.session) return generalMetadata;

	const session = await fetchSession({
		session: searchParams.session,
	});
	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (!session || !organization) return generalMetadata;

	const thumbnail =
		session.coverImage || (await generateThumbnailAction(session));

	return watchMetadata({ organization, session: session, thumbnail });
}
