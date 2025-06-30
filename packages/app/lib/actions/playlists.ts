"use server";

import { apiUrl } from "@/lib/utils/utils";
import { IPlaylist } from "streameth-new-server/src/interfaces/playlist.interface";
import { revalidateTag } from "next/cache";
import { fetchClient } from "../services/fetch-client";
import { ActionResult } from "../types";

export async function createPlaylistAction({
	playlist,
}: {
	playlist: {
		name: string;
		description?: string;
		organizationId: string;
		isPublic?: boolean;
	};
}): Promise<IPlaylist> {
	try {
		const response = await fetchClient(
			`${apiUrl()}/playlists/${playlist.organizationId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: playlist.name,
					description: playlist.description,
					sessions: [], // Start with empty sessions array
					isPublic: playlist.isPublic ?? false,
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to create playlist");
		}

		const data = await response.json();
		revalidateTag(`playlists-${playlist.organizationId}`);
		return data.data;
	} catch (error) {
		console.error("Error in createPlaylistAction:", error);
		throw error;
	}
}

export async function updatePlaylistAction({
	playlist,
	organizationId,
	playlistId,
}: {
	playlist: {
		name?: string;
		description?: string;
		isPublic?: boolean;
		sessions?: string[];
	};
	organizationId: string;
	playlistId: string;
}): Promise<IPlaylist> {
	try {
		const response = await fetchClient(
			`${apiUrl()}/playlists/${organizationId}/${playlistId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(playlist),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to update playlist");
		}

		const data = await response.json();
		revalidateTag(`playlists-${organizationId}`);
		return data.data;
	} catch (error) {
		console.error("Error in updatePlaylistAction:", error);
		throw error;
	}
}

export async function deletePlaylistAction({
	organizationId,
	playlistId,
}: {
	organizationId: string;
	playlistId: string;
}): Promise<void> {
	try {
		const response = await fetchClient(
			`${apiUrl()}/playlists/${organizationId}/${playlistId}`,
			{
				method: "DELETE",
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to delete playlist");
		}

		revalidateTag(`playlists-${organizationId}`);
	} catch (error) {
		console.error("Error in deletePlaylistAction:", error);
		throw error;
	}
}

export async function addSessionToPlaylistAction({
	organizationId,
	playlistId,
	sessionId,
}: {
	organizationId: string;
	playlistId: string;
	sessionId: string;
}): Promise<ActionResult<IPlaylist>> {
	try {
		const response = await fetchClient(
			`${apiUrl()}/playlists/${organizationId}/${playlistId}`,
			{
				method: "GET",
			},
		);

		if (!response.ok) {
			const error = await response.json();
			return {
				success: false,
				error: error.message || "Failed to fetch playlist",
			};
		}

		const playlist = await response.json();
		const sessions = playlist.data.sessions || [];

		if (sessions.includes(sessionId)) {
			return {
				success: false,
				error: "Session is already in this playlist",
			};
		}

		const updateResponse = await fetchClient(
			`${apiUrl()}/playlists/${organizationId}/${playlistId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					sessions: [...sessions, sessionId],
				}),
			},
		);

		if (!updateResponse.ok) {
			const error = await updateResponse.json();
			return {
				success: false,
				error: error.message || "Failed to add session to playlist",
			};
		}

		const data = await updateResponse.json();
		revalidateTag(`playlists-${organizationId}`);
		return { success: true, data: data.data as IPlaylist };
	} catch (error) {
		console.error("Error in addSessionToPlaylistAction:", error);

		return {
			success: false,
			error: "An unexpected server error occurred.",
		};
	}
}

