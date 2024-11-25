'use server';

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { eLayout, eSort } from '@/lib/types';
import Library from './components/Library';
import LibraryFilter from './components/LibraryFilter';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import { fetchOrganization } from '@/lib/services/organizationService';
import NotFound from '@/not-found';

const LibraryPage = async ({
  params,
  searchParams,
}: {
  params: { organization: string };
  searchParams: { layout: eLayout; sort: eSort; show: boolean };
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return NotFound();
  }

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
            <Filters organizationId={organization._id.toString()} />
          </div>
        </div>
      </div>
      <Library
        params={params}
        searchParams={searchParams}
        organization={organization}
      />
    </div>
  );
};

const Filters = async ({ organizationId }: { organizationId: string }) => {
  const stages = await fetchOrganizationStages({
    organizationId: organizationId,
  });

  return (
    <Suspense
      fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}
    >
      <LibraryFilter stages={stages} />
    </Suspense>
  );
};

export default LibraryPage;
