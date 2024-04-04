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
import { eLayout } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import NotFound from '@/not-found'
import { Suspense } from 'react'

const Library = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { layout: eLayout }
}) => {
  if (!searchParams.layout) {
    redirect(`/studio/${params.organization}/library?layout=list`)
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
          sessions={sessions}
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
          sessions={sessions}
          organizationId={organization._id.toString()}
          organizationSlug={params.organization}
        />
      </div>
    )
  }

  redirect(`/studio/${params.organization}/library?layout=list`)
}

export default Library
