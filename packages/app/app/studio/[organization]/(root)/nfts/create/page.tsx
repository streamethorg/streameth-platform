import React from "react";
import CreateNFTForm from "./components/CreateNFTForm";
import { fetchAllSessions } from "@/lib/services/sessionService";
import { fetchOrganization } from "@/lib/services/organizationService";
import { INFTSessions } from "@/lib/types";
import { fetchOrganizationStages } from "@/lib/services/stageService";
import { NftCollectionType } from "streameth-new-server/src/interfaces/nft.collection.interface";

const CreateNFT = async ({
	params,
	searchParams,
}: {
	params: Promise<{ organization: string }>;
	searchParams: Promise<{ type: string }>;
}) => {
	const { type } = await searchParams;
	const { organization } = await params;

	const organizationId = (
		await fetchOrganization({ organizationId: organization })
	)?._id;
	const videos = (
		await fetchAllSessions({
			organizationId: organizationId,
			onlyVideos: true,
		})
	).sessions;
	if (!organizationId || !type) return null;
	const stages = await fetchOrganizationStages({ organizationId });

	return (
		<div className="overflow-auto mx-auto max-w-5xl h-full">
			<CreateNFTForm
				videos={videos as INFTSessions[]}
				stages={stages as unknown as INFTSessions[]}
				organizationId={organizationId}
				organizationSlug={organization}
				type={type as NftCollectionType}
			/>
		</div>
	);
};

export default CreateNFT;
