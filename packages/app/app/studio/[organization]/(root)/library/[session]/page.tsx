"use server";

import { StudioPageParams } from "@/lib/types";
import { fetchSession } from "@/lib/services/sessionService";
import { PlayerWithControls } from "@/components/ui/Player";
import { notFound } from "next/navigation";
import EditSessionForm from "./components/EditSessionForm";
import SessionOptions from "./components/SessionOptions";
import { getVideoUrlAction } from "@/lib/actions/livepeer";
import SessionTranscriptions from "./components/SessionTranscriptions";
import { Suspense } from "react";
import { IExtendedSession } from "@/lib/types";

const EditSession = async ({ params: paramsPromise }: StudioPageParams) => {
	const params = await paramsPromise;

	if (!params.session) return notFound();
	const session = await fetchSession({
		session: params.session,
	});

	if (!session?.playbackId) throw new Error("Session has no playbackId");

	return (
		<div className="w-full">
			<div className="flex overflow-auto flex-row p-4 space-x-4 w-full max-w-screen-xl">
				{/* Left Column - Video Details (2/3 width) */}
				<div className="p-4 w-2/3 bg-white rounded-xl border">
					<EditSessionForm
						session={session}
						organizationSlug={params.organization}
					/>
				</div>
				{/* Right Column - Player and Accordions (1/3 width) */}
				<div className="flex flex-col p-4 w-1/3 bg-white rounded-xl border">
					<div className="flex-shrink-0 mb-4">
						<Suspense fallback={<PlayerSkeleton />}>
							<Player session={session} />
						</Suspense>
					</div>
					<div className="flex overflow-auto flex-col flex-grow">
						<SessionOptions session={session} />

						<div className="pt-4 mt-4 space-y-4 border-t">
							{/* {session.playbackId && (
                <div className="flex flex-col space-y-2">
                  <Label className="">Playback Id</Label>
                  <TextPlaceholder text={session.playbackId} />
                </div>
              )}
              {session.assetId && (
                <div className="flex flex-col space-y-2">
                  <Label>Asset Id</Label>
                  <TextPlaceholder text={session.assetId} />
                </div>
              )} */}
							<SessionTranscriptions
								videoTranscription={session.transcripts?.text}
								summary={session.transcripts?.summary}
								sessionId={session._id}
								transcriptionState={session.transcripts?.status ?? null}
							/>
							{/* <GetHashButton session={session} /> */}
							<div className="flex flex-col space-y-2">
								{/* <Label>Publish to Socials</Label> */}
								<div className="flex flex-row gap-2">
									{/* <UploadToYoutubeButton
                    organization={organization}
                    organizationSlug={params.organization}
                    sessionId={session._id}
                  />
                  <UploadTwitterButton
                    organization={organization}
                    organizationSlug={params.organization}
                    sessionId={session._id}
                  /> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditSession;

const Player = async ({ session }: { session: IExtendedSession }) => {
	const videoUrl = await getVideoUrlAction(session);
	if (!videoUrl) return notFound();

	return (
		<PlayerWithControls
			caption={session?.transcripts?.subtitleUrl}
			src={[
				{
					src: videoUrl as `${string}m3u8`,
					width: 1920,
					height: 1080,
					mime: "application/vnd.apple.mpegurl",
					type: "hls",
				},
			]}
		/>
	);
};

const PlayerSkeleton = () => (
	<div className="w-full bg-gray-200 rounded-md animate-pulse aspect-video">
		<div className="flex justify-center items-center h-full">
			<span>Loading player...</span>
		</div>
	</div>
);
