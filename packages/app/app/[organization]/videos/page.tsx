import {
	ChannelPageParams,
	IExtendedEvent,
	OrganizationPageProps,
} from "@/lib/types";
import { Metadata } from "next";
import { fetchEvents } from "@/lib/services/eventService";
import { Suspense } from "react";
import ArchiveVideos from "./components/ArchiveVideos";
import ArchiveVideoSkeleton from "../livestream/components/ArchiveVideosSkeleton";
import Image from "next/image";
import { fetchOrganization } from "@/lib/services/organizationService";
import { notFound } from "next/navigation";
import EventSelect from "./components/eventSelect";
import { fetchAllSessions } from "@/lib/services/sessionService";
import { generalMetadata, organizationMetadata } from "@/lib/utils/metadata";

export default async function ArchivePage({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: OrganizationPageProps) {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	if (!params.organization) {
		return notFound();
	}

	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (!organization) {
		return notFound();
	}

	const events = await fetchEvents({
		organizationId: organization?._id,
	});

	const results = await Promise.all(
		events.map(async (event) => {
			const sessions = (
				await fetchAllSessions({
					event: event._id.toString(),
					onlyVideos: true,
					published: "public",
				})
			).sessions;

			return sessions.length > 0 ? event : undefined;
		}),
	);

	const eventsWithVideos = results.filter((event) => event !== undefined);

	return (
		<div className="flex flex-col w-full h-full">
			{organization.banner && (
				<div className="hidden relative w-full h-full md:block aspect-video max-h-[200px]">
					<Image
						src={organization.banner}
						alt="banner"
						quality={100}
						objectFit="cover"
						fill
						priority
					/>
				</div>
			)}
			<div className="p-4 m-auto w-full max-w-7xl h-full">
				<div className="flex flex-row justify-between items-center mb-4 space-x-2 w-full">
					<div className="w-full text-lg font-bold">
						{searchParams.searchQuery ? "Search results" : "All videos"}
					</div>
					<div>
						<EventSelect events={eventsWithVideos as IExtendedEvent[]} />
					</div>
				</div>
				<Suspense fallback={<ArchiveVideoSkeleton />}>
					<ArchiveVideos
						organizationId={organization._id}
						organizationSlug={params.organization}
						searchQuery={searchParams.searchQuery}
						page={Number(searchParams.page) || 1}
						gridLength={12}
					/>
				</Suspense>
			</div>
		</div>
	);
}

export async function generateMetadata({
	params: paramsPromise,
}: ChannelPageParams): Promise<Metadata> {
	const params = await paramsPromise;

	if (!params.organization) {
		return generalMetadata;
	}

	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (!organization) {
		return generalMetadata;
	}

	return organizationMetadata({
		organization,
	});
}
