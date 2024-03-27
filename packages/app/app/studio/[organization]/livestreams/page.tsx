import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import React from 'react'
import CreateLivestreamModal from './CreateLivestreamModal'
import { fetchOrganization } from '@/lib/services/organizationService'
import { LivestreamPageParams } from '@/lib/types'
import Livestream from './Livestream'

const Livestreams = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
  const { streamId } = searchParams
  if (!organization) return null

  return (
    <div>
      {!streamId ? (
        <Card className="shadow-none p-4 bg-secondary lg:border-none">
          <CardHeader>
            <CardTitle>Livestreams</CardTitle>
            <CardDescription className="max-w-[500px]">
              Manage your old livestreams or go live!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <CreateLivestreamModal organization={organization} />
          </CardFooter>
        </Card>
      ) : (
        <Livestream
          organizationSlug={params?.organization}
          streamId={streamId}
        />
      )}
    </div>
  )
}

export default Livestreams
