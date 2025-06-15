import { fetchAllSessions, fetchSession } from "@/lib/services/sessionService";
import { fetchStage, fetchStageRecordings } from "@/lib/services/stageService";
import { ClipsPageParams, IExtendedSession } from "@/lib/types";
import React from "react";
import { ClipPageProvider } from "./ClipPageContext";
import Controls from "./Controls";
import ReactHlsPlayer from "./Player";
import Timeline from "./Timeline";
import Sidebar from "./sidebar";
import TopBar from "./topBar";
import { getVideoUrlAction } from "@/lib/actions/livepeer";
import { MarkersProvider } from "./sidebar/markers/markersContext";
import { ClipsSidebarProvider } from "./sidebar/clips/ClipsContext";
import { getLiveStageSrcValue } from "@/lib/utils/utils";
import { TimelineProvider } from "./Timeline/TimelineContext";
import { TrimmControlsProvider } from "./Timeline/TrimmControlsContext";
import { SessionType } from "streameth-new-server/src/interfaces/session.interface";

const fetchVideoDetails = async (
	videoType: string,
	stageId: string,
	sessionId?: string,
) => {
	switch (videoType) {
		case "livestream": {
			const liveStage = await fetchStage({ stage: stageId });
			const streamId = liveStage?.streamSettings?.streamId;
			if (!streamId) return null;
			const stageRecordings = await fetchStageRecordings({ streamId });
			if (!stageRecordings) return null;
			const latestRecording = stageRecordings[0];
			if (!latestRecording) return null;
			const sessions =
				(
					await fetchAllSessions({
						stageId: liveStage._id,
						type: SessionType.livestream,
					})
				).sessions || [];

			const videoSrc = getLiveStageSrcValue({
				playbackId: latestRecording.playbackId,
				recordingId: latestRecording.id,
			});
			if (!videoSrc) return null;
			return {
				videoSrc,
				name: liveStage.name,
				transcribe: liveStage.transcripts?.chunks,
				transcibeStatus: liveStage.transcripts?.status,
				aiAnalysisStatus: null,
				type: "livepeer",
				sessions,
				stageRecordings,
			};
		}

		case "recording": {
			const session = await fetchSession({ session: sessionId! });
			if (
				!session ||
				!session.stageId ||
				!session?.playbackId ||
				!session?.assetId
			)
				return null;
			const stage = await fetchStage({ stage: session.stageId as string });
			const stageRecordings = await fetchStageRecordings({
				streamId: stage?.streamSettings?.streamId || "",
			});
			let sessions: IExtendedSession[] = [];
			if (stage) {
				sessions = (
					await fetchAllSessions({
						stageId: stage._id,
						type: SessionType.livestream,
					})
				).sessions;
			}
			const videoSrc = await getVideoUrlAction(session);
			if (!videoSrc) return null;
			return {
				videoSrc,
				name: session.name,
				transcribe: session.transcripts?.chunks,
				transcribeStatus: session.transcripts?.status,
				aiAnalysisStatus: session.aiAnalysis?.status,
				sessions,
				type: "livepeer",
				stageRecordings,
			};
		}

		case "customUrl": {
			const stage = await fetchStage({ stage: stageId });
			if (!stage || !stage.source?.m3u8Url) return null;
			return {
				videoSrc: stage.source?.m3u8Url,
				name: stage.name,
				type: "customUrl",
				sessions: [],
				stageRecordings: [],
				transcribe: [],
				transcribeStatus: null,
				aiAnalysisStatus: null,
			};
		}

		default:
			return null;
	}
};

const ClipsConfig = async ({ params, searchParams }: ClipsPageParams) => {
	const { organization: organizationId, stageId } = await params;
	const { videoType, sessionId } = await searchParams;

	const videoDetails = await fetchVideoDetails(videoType, stageId, sessionId);
	if (!videoDetails) {
		return <div>Video source not found</div>;
	}

	return (
		<ClipPageProvider
			stageId={stageId}
			clipUrl={videoDetails.videoSrc}
			sessionId={sessionId}
		>
			<TimelineProvider>
				<MarkersProvider>
					<ClipsSidebarProvider>
						<TrimmControlsProvider>
							<div className="flex overflow-hidden flex-row w-full h-full border-t border-gray-200">
								<div className="flex h-full w-[calc(100%-400px)] flex-col">
									<TopBar
										stageRecordings={videoDetails.stageRecordings}
										allSessions={videoDetails.sessions}
										name={videoDetails.name}
										organizationId={organizationId}
										stageId={stageId}
										sessionId={sessionId}
									/>
									<ReactHlsPlayer
										src={videoDetails.videoSrc}
										type={videoDetails.type}
									/>
									<Controls />
									<div className="p-2 w-full bg-white">
										<Timeline />
									</div>
								</div>
								<div className="flex h-full w-[400px]">
									<Sidebar
										transcribe={videoDetails.transcribe || []}
										transcribeStatus={videoDetails.transcribeStatus ?? null}
										aiAnalysisStatus={videoDetails.aiAnalysisStatus ?? null}
									/>
								</div>
							</div>
						</TrimmControlsProvider>
					</ClipsSidebarProvider>
				</MarkersProvider>
			</TimelineProvider>
		</ClipPageProvider>
	);
};

export default ClipsConfig;
