import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import StagePreview from "../stage/components/StagePreview";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SpeakerComponent, {
	SpeakerComponentSkeleton,
} from "../speakers/components/SpeakerComponent";
import ScheduleComponent, {
	ScheduleSkeleton,
} from "../schedule/components/ScheduleComponent";
import Image from "next/image";
import { formatDate, isSameDate } from "@/lib/utils/time";
import { Suspense } from "react";
import banner from "@/public/streameth_twitter_banner.jpeg";
import { IExtendedEvent, IExtendedStage } from "@/lib/types";
import SignUp from "@/components/plugins/SignUp";
import MarkdownDisplay from "@/components/misc/MarkdownDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StageComponent from "../stage/components/StageComponent";

export default function EventHomeComponent({
	event,
	stages,
	params,
	searchParams,
}: {
	event: IExtendedEvent;
	stages: IExtendedStage[];

	params: {
		organization: string;
	};
	searchParams: {
		stage?: string;
		date?: string;
		livestream?: string;
	};
}) {
	const style = {
		"--colors-accent": event.accentColor,
	} as React.CSSProperties;
	const bannerImg = event.banner !== "" ? event.banner : banner;
	return (
		<div
			className="flex flex-col px-2 w-full bg-background"
			style={{ ...style }}
		>
			<div className="relative z-50 mx-auto space-y-4 w-full max-w-full lg:my-4 lg:max-w-5xl">
				{!searchParams.livestream ? (
					<Card className="bg-white border shadow-none lg:rounded-xl">
						<AspectRatio ratio={3 / 1} className="p-2 rounded-xl overflow-clip">
							<Image
								className="object-contain h-full rounded-lg"
								src={bannerImg!}
								alt="Event Cover"
								width={1500}
								height={500}
								style={{
									objectFit: "cover",
								}}
							/>
						</AspectRatio>
						<CardHeader className="flex flex-row items-start">
							<div className="flex flex-col gap-2 justify-start items-start my-2 w-full">
								<CardTitle className="text-4xl uppercase">
									{event.name}
								</CardTitle>
								{event.dataImporter?.[0]?.config?.sheetId && (
									<SignUp event={event} />
								)}
							</div>
							<div className="space-y-2 text-sm lg:min-w-[300px]">
								<p>
									<span className="mr-2">&#128197;</span>
									{formatDate(new Date(event.start))}
									{!isSameDate(new Date(event.start), new Date(event.end))
										? ` - ${formatDate(new Date(event.end))}`
										: ""}
								</p>
								<p>
									<span className="mr-2">&#9200;</span>
									<span className="capitalize">
										{event?.startTime
											? `${event.startTime?.replace(/\s?[AP]M/g, "")} - ${
													event.endTime
														? event.endTime?.replace(/\s?[AP]M/g, "")
														: ""
												} ${event.timezone}`
											: "TBD"}
									</span>
								</p>

								<p>
									<span className="mr-2">&#127759;</span>
									{event.location}
								</p>
							</div>
						</CardHeader>
					</Card>
				) : (
					<StageComponent event={event} stageId={searchParams.livestream} />
				)}
				<Tabs
					defaultValue="schedule"
					className="p-2 bg-white rounded-xl border"
				>
					<TabsList className="justify-start w-full bg-white">
						<TabsTrigger value="about">About</TabsTrigger>
						<TabsTrigger value="livestreams">Livestreams</TabsTrigger>
						<TabsTrigger value="schedule">Schedule</TabsTrigger>
						<TabsTrigger value="speakers">Speakers</TabsTrigger>
					</TabsList>
					<TabsContent className="p-2" value="about">
						<MarkdownDisplay content={event.description} />
					</TabsContent>
					<TabsContent value="livestreams">
						<div className="grid gap-4 w-full lg:grid-cols-2">
							{stages?.map((stage) => (
								<StagePreview
									key={stage._id}
									event={event._id}
									organization={params.organization}
									stage={stage}
									eventCover={event?.eventCover}
								/>
							))}
						</div>
					</TabsContent>

					<TabsContent value="schedule" className="h-full">
						<Suspense fallback={<ScheduleSkeleton />}>
							<ScheduleComponent
								stages={stages}
								event={event}
								stage={searchParams.stage}
								date={searchParams.date}
							/>
						</Suspense>
					</TabsContent>
					<TabsContent value="speakers">
						<Suspense fallback={<SpeakerComponentSkeleton />}>
							<SpeakerComponent event={event} />
						</Suspense>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
