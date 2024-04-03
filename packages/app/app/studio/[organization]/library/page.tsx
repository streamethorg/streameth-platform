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
import UploadVideoDialog from '../components/library/UploadVideoDialog'
import GridLayout from './components/GridLayout'
import { Suspense } from 'react'
import { eLayout } from '@/lib/types'

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
            <UploadVideoDialog organization={params.organization} />
          </CardFooter>
        </Card>
        <Suspense>
          <ListLayout
            sessions={sessions}
            organizationSlug={params.organization}
          />
        </Suspense>
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
            <UploadVideoDialog organization={params.organization} />
          </CardFooter>
        </Card>
        <Suspense>
          <GridLayout
            sessions={sessions}
            organizationSlug={params.organization}
          />
        </Suspense>
      </div>
    )
  }
}

export default Library
