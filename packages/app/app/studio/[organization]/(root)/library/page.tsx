'use server';

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { eLayout, eSort } from '@/lib/types';
import Library, { TableSkeleton } from './components/Library';
import LibraryFilter from './components/LibraryFilter';
import { fetchOrganizationStages } from '@/lib/services/stageService';

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
    <div className="flex flex-col w-full h-full bg-white">
      <div className="p-4 w-full">
        <h2 className="mb-2 text-lg font-bold">Video library</h2>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              }
            >
              <Filters organizationId={params.organization} />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<TableSkeleton />} key={JSON.stringify(searchParams)}>
        <Library params={params} searchParams={searchParams} />
      </Suspense>
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
