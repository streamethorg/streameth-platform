'use server'

import { fetchAllSessions } from '@/lib/data'
import { redirect } from 'next/navigation'
import LibraryListLayout from './components/LibraryListLayout'
import UploadVideoDialog from './components/UploadVideoDialog'
import { Suspense } from 'react'
import VideoCardSkeleton from '@/components/misc/VideoCard/VideoCardSkeleton'
import TableSkeleton from '@/components/misc/Table/TableSkeleton'
import EmptyLibrary from './components/EmptyLibrary'
import { IExtendedSession, eLayout, eSort } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import NotFound from '@/not-found'
import { sortArray } from '@/lib/utils/utils'
import LibraryGridLayout from './components/LibraryGridLayout'
import Pagination from '@/app/[organization]/videos/components/pagination'
import SearchBar from '@/components/misc/SearchBar'
import LibraryFilter from './components/LibraryFilter'
import { fetchOrganizationStages } from '@/lib/services/stageService'

const Loading = ({ layout }: { layout: string }) => {
  return (
    <div className="flex h-full w-full flex-col space-y-4 bg-white">
      <div className="w-full p-4">
        <h2 className="mb-2 text-lg font-bold">Video library</h2>
        <div className="flex justify-between">
          <div className="flex items-center"></div>
        </div>
      </div>
      {eLayout.grid === layout && (
        <div className="m-5 grid grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      )}
      {eLayout.list === layout && <TableSkeleton />}
    </div>
  )
}

const Library = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: {
    layout: eLayout
    sort: eSort
    show?: boolean
    limit?: number
    page?: number
    searchQuery?: string
    stage?: string
    type?: string
    published?: boolean
  }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return NotFound()
  }
  const stages = await fetchOrganizationStages({
    organizationId: organization._id,
  })

  const sessions = await fetchAllSessions({
    organizationSlug: params.organization,
    limit: searchParams.limit || 20,
    page: searchParams.page || 1,
    onlyVideos: true,
    searchQuery: searchParams.searchQuery,
    stageId: searchParams.stage,
    published: searchParams.published,
    type: searchParams.type,
  })

  const sortedSessions = sortArray(
    sessions.sessions,
    searchParams.sort
  ) as unknown as IExtendedSession[]

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="w-full p-4">
        <h2 className="mb-2 text-lg font-bold">Video library</h2>
        <div className="flex justify-between">
          <UploadVideoDialog
            organizationId={organization._id.toString()}
          />

          <div className="flex items-center">
            <div className="z-50 min-w-[300px] lg:min-w-[400px]">
              <SearchBar
                organizationSlug={params.organization}
                isStudio
              />
            </div>
            <LibraryFilter stages={stages} />
          </div>
        </div>
      </div>
      {!sessions.sessions || sessions.sessions.length === 0 ? (
        <EmptyLibrary organizationId={organization._id.toString()} />
      ) : (
        <>
          {eLayout.list === searchParams.layout && (
            <LibraryListLayout
              sessions={sortedSessions}
              organizationSlug={params.organization}
            />
          )}
          {eLayout.grid === searchParams.layout && (
            <LibraryGridLayout
              sessions={sortedSessions}
              organizationSlug={params.organization}
            />
          )}
        </>
      )}
      <Pagination {...sessions.pagination} />
    </div>
  )
}

const LibraryPage = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { layout: eLayout; sort: eSort; show: boolean}
}) => {
  if (
    !searchParams.layout ||
    !searchParams.sort ||
    (searchParams.layout !== eLayout.grid &&
      searchParams.layout !== eLayout.list)
  ) {
    redirect(
      `/studio/${params.organization}/library?layout=${eLayout.list}&sort=${eSort.desc_date}&page=1&limit=20`
    )
  }

  return (
    <Suspense
      key={searchParams.toString()}
      fallback={<Loading layout={searchParams.layout} />}>
      <Library params={params} searchParams={searchParams} />
    </Suspense>
  )
}

export default LibraryPage
