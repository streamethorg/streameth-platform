'use server';

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { eLayout, eSort } from '@/lib/types';
import Library, { TableSkeleton } from './components/Library';
import LibraryFilter from './components/LibraryFilter';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const LibraryPage = async ({
  params,
  searchParams,
}: {
  params: { organization: string };
  searchParams: { layout: eLayout; sort: eSort; show: boolean };
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
      <Tabs defaultValue="videos" className="flex-1">
        <TabsList className="ml-4 mb-4">
          <TabsTrigger value="videos">
            <p className="text-lg font-bold">Videos</p>
          </TabsTrigger>
          <TabsTrigger value="playlists">
            <p className="text-lg font-bold">Playlists</p>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="flex-1">
          <div className="px-4 mb-4">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              }
            >
              <Filters organizationId={params.organization} />
            </Suspense>
          </div>
          <Suspense fallback={<TableSkeleton />} key={JSON.stringify(searchParams)}>
            <Library params={params} searchParams={searchParams} />
          </Suspense>
        </TabsContent>
        <TabsContent value="playlists" className="flex-1">
          <div className="px-4 mb-4">
            <CreatePlaylistDialog />
          </div>
          <Suspense fallback={<TableSkeleton />} key={JSON.stringify(searchParams)}>
            <div className="px-4">
              <p>Playlists content coming soon...</p>
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Filters = async ({ organizationId }: { organizationId: string }) => {
  const stages = await fetchOrganizationStages({
    organizationId: organizationId,
  });

  return <LibraryFilter stages={stages} />;
};

export default LibraryPage;
