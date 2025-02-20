'use server';

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { eLayout, eSort } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VideosTab from './components/tabs/VideosTab';
import PlaylistsTab from './components/tabs/PlaylistsTab';
import { TableSkeleton } from './components/Library';
import { PlaylistTableSkeleton } from './components/PlaylistTable';

const LibraryPage = async ({
  params,
  searchParams,
}: {
  params: { organization: string };
  searchParams: { layout: eLayout; sort: eSort; show: boolean; tab?: string };
}) => {
  if (
    !searchParams.layout ||
    (searchParams.layout !== eLayout.grid &&
      searchParams.layout !== eLayout.list)
  ) {
    redirect(
      `/studio/${params.organization}/library?layout=${eLayout.list}&page=1&limit=20`
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative mt-2">
      <Tabs defaultValue={searchParams.tab || 'videos'} className="flex-1">
        <TabsList className="ml-4 mb-4">
          <TabsTrigger value="videos">
            <p className="text-lg font-bold">Videos</p>
          </TabsTrigger>
          <TabsTrigger value="playlists">
            <p className="text-lg font-bold">Playlists</p>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="flex-1">
          <Suspense fallback={<TableSkeleton />}>
            <VideosTab params={params} searchParams={searchParams} />
          </Suspense>
        </TabsContent>
        <TabsContent value="playlists" className="flex-1">
          <Suspense fallback={<PlaylistTableSkeleton />}>
            <PlaylistsTab organizationId={params.organization} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryPage;
