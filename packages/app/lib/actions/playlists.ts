'use server';

import { apiUrl } from '@/lib/utils/utils';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';
import { revalidateTag } from 'next/cache';
import { fetchClient } from '../services/fetch-client';

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
    const response = await fetchClient(`${apiUrl()}/playlists/${playlist.organizationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlist.name,
        description: playlist.description,
        sessions: [], // Start with empty sessions array
        isPublic: playlist.isPublic ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create playlist');
    }

    const data = await response.json();
    revalidateTag(`playlists-${playlist.organizationId}`);
    return data.data;
  } catch (error) {
    console.error('Error in createPlaylistAction:', error);
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
  };
  organizationId: string;
  playlistId: string;
}): Promise<IPlaylist> {
  try {
    const response = await fetchClient(
      `${apiUrl()}/playlists/${organizationId}/${playlistId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update playlist');
    }

    const data = await response.json();
    revalidateTag(`playlists-${organizationId}`);
    return data.data;
  } catch (error) {
    console.error('Error in updatePlaylistAction:', error);
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
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete playlist');
    }

    revalidateTag(`playlists-${organizationId}`);
  } catch (error) {
    console.error('Error in deletePlaylistAction:', error);
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
}): Promise<IPlaylist> {
  try {
    // First get the current playlist to check if session is already included
    const response = await fetchClient(`${apiUrl()}/playlists/${organizationId}/${playlistId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch playlist');
    }

    const playlist = await response.json();
    const sessions = playlist.data.sessions || [];

    // Check if session is already in the playlist
    if (sessions.includes(sessionId)) {
      throw new Error('Session is already in this playlist');
    }

    // Add the session to the playlist
    const updateResponse = await fetchClient(
      `${apiUrl()}/playlists/${organizationId}/${playlistId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessions: [...sessions, sessionId],
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(error.message || 'Failed to add session to playlist');
    }

    const data = await updateResponse.json();
    revalidateTag(`playlists-${organizationId}`);
    return data.data;
  } catch (error) {
    console.error('Error in addSessionToPlaylistAction:', error);
    throw error;
  }
} 