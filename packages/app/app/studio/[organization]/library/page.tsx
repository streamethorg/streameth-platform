'use server'

import { fetchAllSessions } from '@/lib/data'
import { redirect } from 'next/navigation'
import LibraryListLayout from './components/LibraryListLayout'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import UploadVideoDialog from './components/UploadVideoDialog'
import { fetchAllStates } from '@/lib/services/stateService'
import {
  StateStatus,
  StateType,
} from 'streameth-new-server/src/interfaces/state.interface'
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

const Loading = ({ layout }: { layout: string }) => {
  return (
    <div className="flex h-full w-full flex-col space-y-4 bg-white">
      <Card className="bg-secondary p-4 shadow-none lg:border-none">
        <CardHeader>
          <CardTitle>Video library</CardTitle>
          <CardDescription>
            Manage you clips and livestream recordings or upload a new
            video.
          </CardDescription>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
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
  }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return NotFound()
  }

  const statesSet = new Set(
    (
      await fetchAllStates({
        type: StateType.video,
        status: StateStatus.pending,
      })
    ).map((state) => state.sessionId) as unknown as Set<string>
  )

  const sessions = await fetchAllSessions({
    organizationSlug: params.organization,
    limit: searchParams.limit || 20,
    page: searchParams.page || 1,
    onlyVideos: true,
    searchQuery: searchParams.searchQuery,
  })

  const sortedSessions = sortArray(
    sessions.sessions,
    searchParams.sort
  ) as unknown as IExtendedSession[]

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <Card
        style={{
          backgroundImage: `url(/backgrounds/nftBg.svg)`,
        }}
        className="rounded-none border-none bg-black bg-cover bg-no-repeat p-4 text-white shadow-none">
        <CardHeader>
          <CardTitle>Video library</CardTitle>
          <CardDescription className="text-white">
            Manage you clips and livestream recordings or upload a new
            video.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <UploadVideoDialog
            organizationId={organization._id.toString()}
          />
        </CardFooter>
      </Card>
      <div className="z-[999] p-2">
        <SearchBar organizationSlug={params.organization} isStudio />
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
  searchParams: { layout: eLayout; sort: eSort; show: boolean }
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
