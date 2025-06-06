import { WatchPageProps } from "@/lib/types";
import { Metadata } from "next";
import { apiUrl } from "@/lib/utils/utils";
import { notFound } from "next/navigation";
import { generalMetadata, watchMetadata } from "@/lib/utils/metadata";
import { fetchSession } from "@/lib/services/sessionService";
import { redirect } from "next/navigation";
import { fetchOrganization } from "@/lib/services/organizationService";
import { generateThumbnailAction } from "@/lib/actions/sessions";

export default async function Watch({
	searchParams: searchParamsPromise,
}: WatchPageProps) {
	const searchParams = await searchParamsPromise;

	if (!searchParams.session) return notFound();
	const video = await fetchSession({
		session: searchParams.session,
	});

	if (!video) return notFound();
	const organization = await fetchOrganization({
		organizationId: video.organizationId as string,
	});
	if (!organization) {
		return notFound();
	}

	redirect(`/${organization._id}/watch?session=${searchParams.session}`);
}

export async function generateMetadata({
	searchParams: searchParamsPromise,
}: WatchPageProps): Promise<Metadata> {
	const searchParams = await searchParamsPromise;

	const response = await fetch(`${apiUrl()}/sessions/${searchParams.session}`);
	const responseData = await response.json();
	const video = responseData.data;

	if (!searchParams.session) return generalMetadata;

	if (!video) return generalMetadata;
	const thumbnail = video.coverImage || (await generateThumbnailAction(video));

	return watchMetadata({ session: video, thumbnail });
}
