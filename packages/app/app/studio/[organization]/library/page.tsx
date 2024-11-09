'use server';

import { fetchAllSessions } from '@/lib/data';
import { redirect } from 'next/navigation';
import LibraryListLayout from './components/LibraryListLayout';
import UploadVideoDialog from './components/UploadVideoDialog';
import { Suspense } from 'react';
import TableSkeleton from '@/components/misc/Table/TableSkeleton';
import EmptyLibrary from './components/EmptyLibrary';
import { IExtendedSession, eLayout, eSort } from '@/lib/types';
import { fetchOrganization } from '@/lib/services/organizationService';
import NotFound from '@/not-found';
import { sortArray } from '@/lib/utils/utils';
import Pagination from './components/Pagination';
import SearchBar from '@/components/misc/SearchBar';
import LibraryFilter from './components/LibraryFilter';
import { fetchOrganizationStages } from '@/lib/services/stageService';

const Loading = ({ layout }: { layout: string }) => {
  return (
    <div className="flex flex-col space-y-4 w-full h-full bg-white">
      <div className="p-4 w-full">
        <h2 className="mb-2 text-lg font-bold">Video library</h2>
        <div className="flex justify-between">
          <div className="flex items-center"></div>
        </div>
      </div>
      <TableSkeleton />
    </div>
  );
};

const Library = async ({
  params,
  searchParams,
}: {
  params: { organization: string };
  searchParams: {
    layout: eLayout;
    sort: eSort;
    show?: boolean;
    limit?: number;
    page?: number;
    searchQuery?: string;
    stage?: string;
    type?: string;
    published?: string;
  };
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) {
    return NotFound();
  }
  const stages = await fetchOrganizationStages({
    organizationId: organization._id,
  });

  let sessions = await fetchAllSessions({
    organizationSlug: params.organization,
    limit: searchParams.limit || 20,
    page: searchParams.page || 1,
    // onlyVideos: true,
    searchQuery: searchParams.searchQuery,
    stageId: searchParams.stage,
    published: searchParams.published,
    type: searchParams.type,
  });

  // We do not need to refilter sessions since we are fetching onlyVideos
  const sortedSessions = sortArray(
    sessions.sessions,
    searchParams.sort
  ) as unknown as IExtendedSession[];

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="p-4 w-full">
        <h2 className="mb-2 text-lg font-bold">Video library</h2>
        <div className="flex justify-between">
          <UploadVideoDialog organizationId={organization._id.toString()} />

          <div className="flex items-center">
            <div className="z-50 min-w-[300px] lg:min-w-[400px]">
              <SearchBar organizationSlug={params.organization} isStudio />
            </div>
            <LibraryFilter stages={stages} />
          </div>
        </div>
      </div>
      {!sortedSessions || sortedSessions.length === 0 ? (
        <EmptyLibrary organizationId={organization._id.toString()} />
      ) : (
        <LibraryListLayout
          sessions={sortedSessions}
          organizationSlug={params.organization}
        />
      )}
      <Pagination {...sessions.pagination} />
    </div>
  );
};

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
    <Suspense
      key={searchParams.toString()}
      fallback={<Loading layout={searchParams.layout} />}
    >
      <Library params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default LibraryPage;
