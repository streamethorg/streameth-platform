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
        isPublic: false, // Default to private
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