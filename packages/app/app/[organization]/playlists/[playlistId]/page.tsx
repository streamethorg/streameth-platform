import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPlaylist } from '@/lib/services/playlistService';
import { fetchOrganization } from '@/lib/services/organizationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import ChannelBanner from '../../components/ChannelBanner';
import ArchiveVideoSkeleton from '../../livestream/components/ArchiveVideosSkeleton';
import PlaylistVideos from '../components/PlaylistVideos';

export async function generateMetadata({
  params,
}: {
  params: { organization: string; playlistId: string };
}): Promise<Metadata> {
  const playlist = await fetchPlaylist({
    organizationId: params.organization,
    playlistId: params.playlistId,
  });
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  return {
    title: `${playlist?.name || 'Playlist'} - ${organization?.name}`,
    description: playlist?.description,
    openGraph: {
      title: `${playlist?.name} - ${organization?.name}`,
      description: playlist?.description || `A collection of videos curated by ${organization?.name}`,
    },
  };
}

export default async function PlaylistPage({
  params,
  searchParams,
}: {
  params: { organization: string; playlistId: string };
  searchParams: { page?: string };
}) {
  const playlist = await fetchPlaylist({
    organizationId: params.organization,
    playlistId: params.playlistId,
  });
  const organization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (!playlist || !organization) {
    return notFound();
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 md:p-4">
      <ChannelBanner />
      <div className="space-y-4 px-4 md:px-0">
        <h1 className="text-3xl font-bold">{playlist.name}</h1>
        {playlist.description && (
          <p className="text-muted-foreground">{playlist.description}</p>
        )}
        <Tabs defaultValue="videos">
          <TabsList>
            <TabsTrigger value="videos">
              <h2 className="text-lg font-semibold">Videos</h2>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos">
            <Suspense fallback={<ArchiveVideoSkeleton />}>
              <PlaylistVideos
                organizationId={params.organization}
                playlistId={params.playlistId}
                page={page}
                gridLength={12}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 