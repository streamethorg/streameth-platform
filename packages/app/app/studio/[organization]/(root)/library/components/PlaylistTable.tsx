"use client";

import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { IPlaylist } from "streameth-new-server/src/interfaces/playlist.interface";
import { formatDate } from "@/lib/utils/time";
import { Button } from "@/components/ui/button";
import { FilePenLine, Loader2, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Thumbnail from "@/components/misc/VideoCard/thumbnail";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";
import { deletePlaylistAction } from "@/lib/actions/playlists";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import EmptyFolder from "@/lib/svg/EmptyFolder";
interface PlaylistTableProps {
	playlists: Array<IPlaylist & { createdAt: string }>;
}

const PlaylistTable = ({ playlists }: PlaylistTableProps) => {
	const params = useParams();
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [playlistToDelete, setPlaylistToDelete] = useState<IPlaylist | null>(
		null,
	);

	const handleDelete = async () => {
		if (!playlistToDelete?._id) return;

		setIsDeleting(true);
		try {
			await deletePlaylistAction({
				organizationId: params.organization as string,
				playlistId: playlistToDelete._id.toString(),
			});
			toast.success("Playlist deleted successfully");
			router.refresh();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete playlist";
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
			setPlaylistToDelete(null);
		}
	};

	if (!playlists || playlists.length === 0) {
		return (
			<div className="bg-white rounded-xl mx-0 my-2 border h-[calc(100%-90px)]">
				<div className="flex flex-col justify-center items-center p-4 space-y-6 h-full bg-white rounded-xl">
					<EmptyFolder />
					<div className="flex flex-col items-center">
						<p className="text-3xl font-bold">No playlists here</p>
						<p className="text-xl text-gray-500">
							Create your first playlist to get started!
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="bg-white rounded-xl mx-0 my-2 border h-[calc(100%-90px)]">
				<Table className="bg-white">
					<TableHeader className="sticky top-0 z-10 bg-white rounded-t-xl">
						<TableRow className="rounded-t-xl hover:bg-white">
							<TableHead>Title</TableHead>
							<TableHead>Videos</TableHead>
							<TableHead>Visibility</TableHead>
							<TableHead>Created at</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="overflow-auto">
						{playlists.map((playlist) => (
							<TableRow key={playlist._id?.toString()}>
								<TableCell className="relative p-2 h-20 font-medium md:p-2 max-w-[300px]">
									<div className="flex flex-row items-center space-x-4 w-full h-full max-w-[500px]">
										<div className="min-w-[100px]">
											<Thumbnail />
										</div>
										<div className="flex flex-col">
											<Link
												href={`/studio/${params.organization}/library/playlists/${playlist._id}`}
											>
												<span className="hover:underline line-clamp-2">
													{playlist.name}
												</span>
											</Link>
											{playlist.description && (
												<span className="text-sm text-muted-foreground line-clamp-1">
													{playlist.description}
												</span>
											)}
										</div>
									</div>
								</TableCell>
								<TableCell>
									{playlist.sessions.length} video
									{playlist.sessions.length !== 1 ? "s" : ""}
								</TableCell>
								<TableCell>
									<span
										className={
											playlist.isPublic ? "text-green-500" : "text-yellow-500"
										}
									>
										{playlist.isPublic ? "Public" : "Private"}
									</span>
								</TableCell>
								<TableCell>
									{formatDate(
										new Date(playlist.createdAt),
										"ddd. MMM. D, YYYY",
									)}
								</TableCell>
								<TableCell className="w-[220px]">
									<div className="flex relative gap-2 justify-between items-center">
										<CreatePlaylistDialog
											playlist={playlist}
											trigger={
												<Button
													variant="outline"
													size="sm"
													className="flex gap-2 items-center h-8"
												>
													<FilePenLine className="w-4 h-4" />
													<span>Edit</span>
												</Button>
											}
										/>
										<Button
											size="sm"
											variant="destructiveOutline"
											className="flex gap-2 items-center h-8"
											onClick={() => setPlaylistToDelete(playlist)}
											disabled={isDeleting}
										>
											{isDeleting ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<Trash className="w-4 h-4" />
											)}
											<span>Delete</span>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<AlertDialog
				open={!!playlistToDelete}
				onOpenChange={() => setPlaylistToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the playlist &quot;
							{playlistToDelete?.name}&quot;. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-red-500 hover:bg-red-600"
						>
							{isDeleting ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export const PlaylistTableSkeleton = () => {
	return (
		<div className="bg-white rounded-xl mx-0 my-2 border h-[calc(100%-90px)]">
			<Table className="bg-white">
				<TableHeader className="sticky top-0 z-10 bg-white rounded-t-xl">
					<TableRow className="rounded-t-xl hover:bg-white">
						<TableHead>Title</TableHead>
						<TableHead>Videos</TableHead>
						<TableHead>Visibility</TableHead>
						<TableHead>Created at</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="overflow-auto">
					{[...Array(5)].map((_, index) => (
						<TableRow key={index}>
							<TableCell className="relative p-2 h-20 font-medium md:p-2 max-w-[300px]">
								<div className="flex flex-row items-center space-x-4 w-full h-full max-w-[500px]">
									<div className="bg-gray-200 rounded-lg animate-pulse min-w-[100px] aspect-video" />
									<div className="flex flex-col flex-1 space-y-2">
										<div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
										<div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
							</TableCell>
							<TableCell>
								<div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
							</TableCell>
							<TableCell>
								<div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
							</TableCell>
							<TableCell>
								<div className="flex gap-2 justify-between items-center">
									<div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
									<div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default PlaylistTable;
