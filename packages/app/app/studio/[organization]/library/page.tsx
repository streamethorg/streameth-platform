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
import { IExtendedSession, eLayout, eSort } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import NotFound from '@/not-found'
import { sortArray } from '@/lib/utils/utils'

const Library = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { layout: eLayout; sort: eSort }
}) => {
  if (!searchParams.layout || !searchParams.sort) {
    redirect(
      `/studio/${params.organization}/library?layout=${eLayout.list}&sort=${eSort.asc_alpha}`
    )
  }

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
  ).sessions.filter((session) => session.videoUrl)

  const sortedSessions = sortArray(sessions, searchParams.sort)
  if (searchParams.layout === eLayout.list) {
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
        <ListLayout
          sessions={sortedSessions as IExtendedSession[]}
          organizationId={organization._id.toString()}
          organizationSlug={params.organization}
        />
      </div>
    )
  } else if (searchParams.layout === eLayout.grid) {
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
        <GridLayout
          sessions={sortedSessions as IExtendedSession[]}
          organizationId={organization._id.toString()}
          organizationSlug={params.organization}
        />
      </div>
    )
  }

  redirect(
    `/studio/${params.organization}/library?layout=${eLayout.list}&sort=${eSort.asc_alpha}`
  )
}

export default Library
