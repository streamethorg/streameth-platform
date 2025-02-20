'use server';

import { Suspense } from 'react';
import { eLayout, eSort } from '@/lib/types';
import Library, { TableSkeleton } from '../Library';
import LibraryFilter from '../LibraryFilter';
import { fetchOrganizationStages } from '@/lib/services/stageService';

interface VideosTabProps {
  params: { organization: string };
  searchParams: { layout: eLayout; sort: eSort; show: boolean };
}

const VideosTab = async ({ params, searchParams }: VideosTabProps) => {
  return (
    <>
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
    </>
  );
};

const Filters = async ({ organizationId }: { organizationId: string }) => {
  const stages = await fetchOrganizationStages({
    organizationId: organizationId,
  });

  return <LibraryFilter stages={stages} />;
};

export default VideosTab; 