import { fetchStages } from "@/lib/services/stageService";
import LivestreamCard from "@/components/misc/VideoCard/LivestreamCard";
import React from "react";
import { VideoCardSkeletonMobile } from "@/components/misc/VideoCard/VideoCardSkeleton";
import { Podcast } from "lucide-react";

const LiveStreams = async ({
	organizationId,
	currentStreamId,
}: {
	organizationId: string;
	currentStreamId: string;
}) => {
	let livestreams = await fetchStages({
		organizationId,
	});

	livestreams = livestreams.filter((livestream) => {
		const streamDate = new Date(livestream.streamDate as string);
		const today = new Date();

		const streamDateOnly = new Date(
			streamDate.getFullYear(),
			streamDate.getMonth(),
			streamDate.getDate(),
		);
		const todayOnly = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);

		return livestream._id !== currentStreamId && streamDateOnly >= todayOnly;
	});

	console.log(livestreams);

	return (
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{livestreams.map((livestream) => (
					<React.Fragment key={livestream?._id?.toString()}>
						<div>
							<LivestreamCard
								livestream={livestream}
								name={livestream.name}
								date={livestream.streamDate as string}
								thumbnail={livestream.thumbnail ?? ""}
								link={`/${organizationId}/livestream?stage=${livestream?._id?.toString()}`}
							/>
						</div>
					</React.Fragment>
				))}
			</div>
			{livestreams.length === 0 && (
				<div className="flex flex-row justify-center items-center p-4 space-x-4 rounded-xl bg-secondary">
					<Podcast size={20} />
					<p>No scheduled livestreams</p>
				</div>
			)}
		</>
	);
};

export default LiveStreams;

export const LiveStreamsLoading = () => (
	<>
		<div className="w-1/4 h-6 bg-gray-300 rounded md:hidden"></div>
		<div className="grid grid-rows-3 gap-4 m-5 md:hidden md:grid-cols-3 md:m-0">
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className="block md:hidden">
					<VideoCardSkeletonMobile />
				</div>
			))}
		</div>
	</>
);
