"use client";

import { TableCell } from "@/components/ui/table";
import { IExtendedSession } from "@/lib/types";
import { FilePenLine, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils/time";
import Thumbnail from "@/components/misc/VideoCard/thumbnail";
import { ProcessingStatus } from "streameth-new-server/src/interfaces/session.interface";
import { getTypeLabel } from "@/lib/utils/utils";
import {
	LuClapperboard,
	LuFilm,
	LuRadio,
	LuScissors,
	LuScissorsLineDashed,
	LuTrash,
	LuVideo,
} from "react-icons/lu";
import DropdownActions from "./DropdownActions";
import FeatureButton from "@/components/ui/feature-button";
import { useOrganizationContext } from "@/lib/context/OrganizationContext";
import { Button } from "@/components/ui/button";
import DeleteAsset from "./DeleteAsset";
import ViewCounts from "@/app/[organization]/components/ViewCounts";

const TableCells = ({ item }: { item: IExtendedSession }) => {
	const { organizationId } = useOrganizationContext();
	const isPending =
		item.processingStatus === ProcessingStatus.pending ||
		item.processingStatus === ProcessingStatus.rendering;
	const isFailed = item.processingStatus === ProcessingStatus.failed;

	const getStatusClassName = () => {
		if (isPending) return "text-yellow-500";
		if (isFailed) return "text-red-500";
		return "text-green-500";
	};

	const isDisabled = isPending || isFailed;
	const rowBackgroundClass = isFailed
		? "bg-gray-100"
		: isPending
			? "bg-gray-100"
			: "";

	const duration = item.playback?.duration
		? formatDuration(item.playback.duration * 1000) // Convert seconds to milliseconds
		: "N/A";

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "clip":
				return <LuScissors className="w-4 h-4 text-green-500" />;
			case "livestream":
				return <LuRadio className="w-4 h-4 text-red-500" />;
			case "video":
				return <LuVideo className="w-4 h-4 text-sky-500" />;
			case "animation":
				return <LuClapperboard className="w-4 h-4 text-yellow-500" />;
			case "editorClip":
				return <LuFilm className="w-4 h-4 text-purple-500" />;
			default:
				return <LuVideo className="w-4 h-4 text-sky-500" />;
		}
	};

	return (
		<>
			<TableCell
				className={`p-2 md:p-2 relative font-medium max-w-[300px] h-20 ${rowBackgroundClass}`}
			>
				<div className="flex flex-row items-center space-x-4 w-full h-full max-w-[500px]">
					<div className="min-w-[100px]">
						<Thumbnail imageUrl={item.coverImage} />
					</div>
					<div className="flex flex-col">
						{!isDisabled ? (
							<Link href={`/studio/${organizationId}/library/${item._id}`}>
								<span className="hover:underline line-clamp-2">
									{item.name}
								</span>
							</Link>
						) : (
							<span className="line-clamp-2">{item.name}</span>
						)}
					</div>
				</div>
			</TableCell>
			<TableCell className={`${rowBackgroundClass} max-w-[100px]`}>
				<div className="flex items-center space-x-1">
					{getTypeIcon(item.type)}
					<span>{getTypeLabel(item.type)}</span>
				</div>
			</TableCell>
			<TableCell className={rowBackgroundClass}>
				<div className="flex items-center space-x-1">
					<span>{duration}</span>
				</div>
			</TableCell>
			<TableCell className={rowBackgroundClass}>
				{formatDate(new Date(item.createdAt as string), "ddd. MMM. D, YYYY")}
			</TableCell>
			<TableCell className={rowBackgroundClass}>
				{item.playbackId ? <ViewCounts playbackId={item.playbackId} /> : "N/A"}
			</TableCell>
			<TableCell className={rowBackgroundClass}>
				<div className="flex items-center space-x-1">
					<span className={getStatusClassName()}>{item.processingStatus}</span>
					{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
				</div>
			</TableCell>
			<TableCell className={`${rowBackgroundClass} w-[220px]`}>
				<div className="flex relative gap-2 justify-between items-center">
					{!isDisabled && item.type !== "clip" && (
						<Link
							href={`/studio/${organizationId}/clips/${item.stageId}?sessionId=${item._id}&videoType=recording`}
						>
							<FeatureButton
								variant="outlinePrimary"
								size="sm"
								className="flex gap-2 items-center h-8"
							>
								<LuScissorsLineDashed className="w-4 h-4" />
								<span>Clip</span>
							</FeatureButton>
						</Link>
					)}
					{!isDisabled && (
						<Link href={`/studio/${organizationId}/library/${item._id}`}>
							<FeatureButton
								variant="outline"
								size="sm"
								className="flex gap-2 items-center h-8"
							>
								<FilePenLine className="w-4 h-4" />
								<span>Edit</span>
							</FeatureButton>
						</Link>
					)}
					{!isDisabled && <DropdownActions session={item} />}
					{isDisabled && (
						<DeleteAsset
							session={item}
							TriggerComponent={
								<Button size="sm" variant="destructiveOutline" className="">
									<LuTrash className="w-4 h-4" />
									<p>Delete</p>
								</Button>
							}
						/>
					)}
				</div>
			</TableCell>
		</>
	);
};

export default TableCells;
