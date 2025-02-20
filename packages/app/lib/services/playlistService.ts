'use server';

import { apiUrl } from '@/lib/utils/utils';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';

export async function fetchOrganizationPlaylists({
  organizationId,
}: {
  organizationId: string;
}): Promise<Array<IPlaylist & { createdAt: string }>> {
  try {
    const response = await fetch(`${apiUrl()}/playlists/${organizationId}`, {
      next: {
        tags: [`playlists-${organizationId}`],
        revalidate: 60, // Cache for 1 minute
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in fetchOrganizationPlaylists:', error);
    throw error;
  }
} 