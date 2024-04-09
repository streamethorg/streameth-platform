'use server'

import { fetchAllSessions } from '@/lib/data'
import { redirect } from 'next/navigation'
import ListLayout from './components/ListLayout'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import UploadVideoDialog from './components/UploadVideoDialog'
import GridLayout from './components/GridLayout'
import { eLayout, eSort } from '@/lib/types'
import { fetchAllStates } from '@/lib/services/stateService'
import {
  StateStatus,
  StateType,
} from 'streameth-new-server/src/interfaces/state.interface'
import { Suspense } from 'react'
import VideoCardSkeleton from '@/components/misc/VideoCard/VideoCardSkeleton'
import TableSkeleton from '@/components/misc/Table/TableSkeleton'
import EmptyLibrary from './components/EmptyLibrary'
import { fetchOrganization } from '@/lib/services/organizationService'
import NotFound from '@/not-found'

const Loading = ({ layout }: { layout: string }) => {
  return (
    <div className="flex flex-col space-y-4 w-full h-full bg-white">
      <Card className="p-4 shadow-none lg:border-none bg-secondary">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>
            Upload and manage pre recorded videos
          </CardDescription>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
      {eLayout.grid === layout && (
        <div className="grid grid-cols-4 gap-4 m-5">
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
  searchParams: { layout: eLayout; sort: eSort }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return NotFound()
  }

  const sessions = (
    await fetchAllSessions({
      organizationSlug: params.organization,
      onlyVideos: true,
    })
  ).sessions
    .filter((session) => session.videoUrl)
    .sort((a, b) => {
      switch (searchParams.sort) {
        case eSort.asc_alpha:
          return a.name.localeCompare(b.name)
        case eSort.desc_alpha:
          return b.name.localeCompare(a.name)
        case eSort.asc_date:
          return (
            new Date(a.createdAt!).getTime() -
            new Date(b.createdAt!).getTime()
          )
        case eSort.desc_date:
          return (
            new Date(b.createdAt!).getTime() -
            new Date(a.createdAt!).getTime()
          )
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const states = await fetchAllStates({
    type: StateType.video,
    status: StateStatus.pending,
  })

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <Card className="p-4 shadow-none lg:border-none bg-secondary">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>
            Upload and manage pre recorded videos
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <UploadVideoDialog
            organizationId={organization._id.toString()}
          />
        </CardFooter>
      </Card>
      {!sessions || sessions.length === 0 ? (
        <EmptyLibrary organizationId={organization._id.toString()} />
      ) : (
        <>
          {eLayout.list === searchParams.layout && (
            <ListLayout
              sessions={sessions}
              organizationSlug={params.organization}
            />
          )}
          {eLayout.grid === searchParams.layout && (
            <GridLayout
              sessions={sessions}
              organizationSlug={params.organization}
            />
          )}
        </>
      )}
    </div>
  )
}

const LibraryPage = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { layout: eLayout; sort: eSort }
}) => {
  if (
    !searchParams.layout ||
    !searchParams.sort ||
    (searchParams.layout !== eLayout.grid &&
      searchParams.layout !== eLayout.list)
  ) {
    redirect(
      `/studio/${params.organization}/library?layout=${eLayout.list}&sort=${eSort.asc_alpha}`
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
