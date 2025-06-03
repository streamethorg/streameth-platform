"use server";

import { fetchStage } from "@/lib/services/stageService";
import { LivestreamPageParams } from "@/lib/types";
import StreamHeader from "./components/StreamHeader";
import NotFound from "@/app/not-found";
import StageControls from "./components/StageControls";
import Sidebar from "./components/Sidebar";
import { fetchOrganization } from "@/lib/services/organizationService";
import { redirect } from "next/navigation";

const Livestream = async ({ params: paramsPromise }: LivestreamPageParams) => {
	const params = await paramsPromise;

	if (!params.streamId) return NotFound();

	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	const isFree = organization?.subscriptionTier === "free";
	if (isFree) {
		return redirect(
			`/studio/${params.organization}/livestreams?blockedAccess=true`,
		);
	}

	const stream = await fetchStage({ stage: params.streamId });

	if (!stream) return NotFound();

	return (
		<div className="flex flex-col p-4 w-full h-full max-h-screen max-w-screen-3xl">
			<div className="flex flex-row flex-grow space-x-4 w-full">
				<div className="flex flex-col w-2/3">
					<StreamHeader stream={stream} isLiveStreamPage />
					<StageControls stream={stream} />
				</div>
				<div className="flex flex-col w-1/3">
					<Sidebar stage={stream} />
				</div>
			</div>
		</div>
	);
};

export default Livestream;
