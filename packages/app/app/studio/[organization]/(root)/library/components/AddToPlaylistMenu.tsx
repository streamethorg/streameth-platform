"use client";

import {
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { addSessionToPlaylistAction } from "@/lib/actions/playlists";
import { useOrganizationContext } from "@/lib/context/OrganizationContext";
import { IPlaylist } from "streameth-new-server/src/interfaces/playlist.interface";
import { ListPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";
import { buttonVariants } from "@/components/ui/button";

interface AddToPlaylistMenuProps {
	sessionId: string;
	playlists: IPlaylist[];
}

export default function AddToPlaylistMenu({
	sessionId,
	playlists,
}: AddToPlaylistMenuProps) {
	const { organizationId } = useOrganizationContext();
	const [isLoading, setIsLoading] = useState<string | null>(null);

	const handleAddToPlaylist = async (playlistId: string) => {
		setIsLoading(playlistId);

		const result = await addSessionToPlaylistAction({
			organizationId,
			playlistId,
			sessionId,
		});

		if (result.success) {
			toast.success("Added to playlist");
		} else {
			toast.error(result.error);
		}

		setIsLoading(null);
	};

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<span
					className={buttonVariants({
						variant: "ghost",
						className: "w-full !justify-start space-x-2",
					})}
				>
					<ListPlus className="w-5 h-5" />
					<p>Add to Playlist</p>
				</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent className="min-w-[200px]">
					{playlists.length === 0 ? (
						<div className="p-2 text-center">
							<p className="mb-2 text-sm text-muted-foreground">
								No playlists yet
							</p>
							<CreatePlaylistDialog />
						</div>
					) : (
						playlists.map((playlist) => (
							<DropdownMenuItem
								key={playlist._id?.toString()}
								onClick={() =>
									handleAddToPlaylist(playlist._id?.toString() as string)
								}
								disabled={!!isLoading}
								className="cursor-pointer"
							>
								{isLoading === playlist._id?.toString() ? (
									<Loader2 className="mr-2 w-4 h-4 animate-spin" />
								) : null}
								{playlist.name}
							</DropdownMenuItem>
						))
					)}
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}

