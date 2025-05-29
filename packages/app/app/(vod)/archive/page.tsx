"use server";

import { SearchPageProps } from "@/lib/types";
import { fetchOrganization } from "@/lib/services/organizationService";
import { fetchEvent } from "@/lib/services/eventService";
import { redirect } from "next/navigation";
import { generalMetadata, archiveMetadata } from "@/lib/utils/metadata";
import { Metadata } from "next";

const ArchivePage = async ({
	searchParams: searchParamsPromise,
}: SearchPageProps) => {
	const searchParams = await searchParamsPromise;

	if (searchParams.organization) {
		const organization = await fetchOrganization({
			organizationId: searchParams.organization,
		});

		if (!organization) {
			return redirect("/404");
		}

		return redirect(`/${organization._id}/videos`);
	}

	if (searchParams.event) {
		const event = await fetchEvent({
			eventSlug: searchParams.event,
		});

		const organization = await fetchOrganization({
			organizationId: event?.organizationId as string,
		});

		if (!event || !organization) {
			return redirect("/404");
		}

		return redirect(`/${organization._id}/videos`);
	}

	return <>Page moved</>;
};

export async function generateMetadata({
	searchParams: searchParamsPromise,
}: SearchPageProps): Promise<Metadata> {
	const searchParams = await searchParamsPromise;

	if (!searchParams.event) return generalMetadata;
	const event = await fetchEvent({
		eventSlug: searchParams.event,
	});

	if (!event) return generalMetadata;
	return archiveMetadata({ event });
}

export default ArchivePage;
