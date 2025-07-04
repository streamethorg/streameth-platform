import { notFound } from "next/navigation";
import { EventPageProps } from "@/lib/types";
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
	}

	redirect(`/${organization._id}`);
}
