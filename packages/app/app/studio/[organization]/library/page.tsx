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

const Loading = ({ layout }: { layout: string }) => {
  return (
    <div className="flex flex-col space-y-4 w-full h-full bg-white">
      <Card className="p-4 shadow-none lg:border-none bg-secondary">
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
  searchParams: { layout: eLayout; sort: eSort; show?: boolean }
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

  const sessions = (
    await fetchAllSessions({
      organizationSlug: params.organization,
    })
  ).sessions.filter(
    (session) =>
      session.videoUrl || statesSet.has(session._id.toString())
  )

  const sortedSessions = sortArray(
    sessions,
    searchParams.sort
  ) as unknown as IExtendedSession[]

  return (
    <div className="flex flex-col w-full h-full">
      <Card
        style={{
          backgroundImage: `url(/backgrounds/nftBg.svg)`,
        }}
        className="text-white bg-black bg-cover border-none shadow-none rounded-none w-full">
        <CardHeader>
          <CardTitle>Video library</CardTitle>
          <CardDescription className='text-white'>
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
      {!sessions || sessions.length === 0 ? (
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
