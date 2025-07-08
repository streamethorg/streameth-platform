"use server";

import SessionInfoBox from "@/components/sessions/SessionInfoBox";
import { IExtendedStage, OrganizationPageProps } from "@/lib/types";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generalMetadata, livestreamMetadata } from "@/lib/utils/metadata";
import { fetchOrganization } from "@/lib/services/organizationService";
import { Suspense } from "react";
import { fetchStage } from "@/lib/services/stageService";
import Player from "./components/Player";
import ArchiveVideoSkeleton from "./components/ArchiveVideosSkeleton";
import ArchiveVideos from "../videos/components/ArchiveVideos";

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

export default async function Livestream({
	params,
	searchParams: searchParamsPromise,
}: OrganizationPageProps) {
	const { organization } = await params;
	const searchParams = await searchParamsPromise;
	if (!searchParams.stage) return notFound();

	const stage = await fetchStage({
		stage: searchParams.stage,
	});

	if (!stage?._id || !stage.streamSettings?.streamId) return notFound();

	return (
		<Suspense key={stage._id} fallback={<Loading />}>
			<div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full md:px-4 md:mt-4">
				<Player stage={stage} />
				<div className="px-4 w-full md:p-0">
					<SessionInfoBox
						name={stage.name}
						description={stage.description ?? ""}
						date={stage.streamDate as string}
						video={stage as IExtendedStage}
					/>
				</div>
				<div className="flex justify-between items-center pb-4">
					<h1 className="text-2xl font-bold">More videos</h1>
					<Link href={`/${organization}`}>
						<h3 className="text-sm hover:underline">See more videos</h3>
					</Link>
				</div>
				<div className="md:hidden">
					<Suspense fallback={<ArchiveVideoSkeleton />}>
						<ArchiveVideos
							sortBy="random"
							organizationId={organization}
							organizationSlug={organization}
							gridLength={4}
						/>
					</Suspense>
				</div>
				<div className="hidden md:block">
					<Suspense fallback={<ArchiveVideoSkeleton />}>
						<ArchiveVideos
							sortBy="random"
							organizationId={organization}
							organizationSlug={organization}
							gridLength={8}
						/>
					</Suspense>
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
	if (!searchParams.stage) return generalMetadata;

	const stage = await fetchStage({
		stage: searchParams.stage,
	});

	const organization = await fetchOrganization({
		organizationId: params?.organization,
	});

	if (!stage || !organization) return generalMetadata;

	return livestreamMetadata({
		livestream: stage,
		organization,
	});
}
