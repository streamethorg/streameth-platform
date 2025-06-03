import { notFound } from "next/navigation";
import { fetchEvent } from "@/lib/services/eventService";
import { EventPageProps } from "@/lib/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchOrganization } from "@/lib/services/organizationService";

export default async function EventHome({
	params: paramsPromise,
}: EventPageProps) {
	const params = await paramsPromise;
	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (!organization) {
		return notFound();
	} else {
		redirect(`/${organization._id}`);
	}
}

export async function generateMetadata({
	params: paramsPromise,
}: EventPageProps): Promise<Metadata> {
	const { event } = await paramsPromise;
	const eventInfo = await fetchEvent({
		eventSlug: event,
	});

	if (!eventInfo) {
		return {
			title: "StreamETH Event",
		};
	}

	const imageUrl = eventInfo.eventCover;
	try {
		return {
			title: eventInfo.name,
			description: eventInfo.description,
			openGraph: {
				title: eventInfo.name,
				description: eventInfo.description,
				images: [imageUrl!],
			},
			twitter: {
				card: "summary_large_image",
				title: eventInfo.name,
				description: eventInfo.description,
				images: {
					url: imageUrl!,
					alt: eventInfo.name + " Logo",
				},
			},
		};
	} catch (e) {
		console.log(e);
		return {
			title: "StreamETH Event",
		};
	}
}
