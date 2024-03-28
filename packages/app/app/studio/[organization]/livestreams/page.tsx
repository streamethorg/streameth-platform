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
import {
  fetchEventStages,
  fetchOrganizationStages,
} from '@/lib/services/stageService'
import LivestreamTable from './LivestreamTable'

const Livestreams = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
  const { streamId } = searchParams
  if (!organization) return null
  const stages = await fetchEventStages({
    eventId: '65a9138b7932ebe436ba96ac',
  })
  console.log(stages)
  return (
    <div>
      {!streamId ? (
        <Card
          style={{
            backgroundImage: `url(/backgrounds/livestreamBg.png)`,
          }}
          className="shadow-none bg-cover bg-no-repeat p-4 lg:border-none">
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

      <LivestreamTable
        organizationSlug={params?.organization}
        streams={stages}
      />
    </div>
  )
}

export default Livestreams
