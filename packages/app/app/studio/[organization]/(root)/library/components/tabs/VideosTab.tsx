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
  const stages = await fetchOrganizationStages({
    organizationId: params.organization,
  });

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <LibraryFilter stages={stages} />
        </div>
        {/* Pagination will be rendered by Library in absolute position */}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <Suspense fallback={<TableSkeleton />} key={JSON.stringify(searchParams)}>
          <Library params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default VideosTab; 