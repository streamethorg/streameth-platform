import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import React from 'react'
import CreateLivestreamModal from './components/CreateLivestreamModal'
import { fetchOrganization } from '@/lib/services/organizationService'
import { LivestreamPageParams } from '@/lib/types'
import { fetchOrganizationStages } from '@/lib/services/stageService'
import LivestreamTable from './components/LivestreamTable'

const Livestreams = async ({ params }: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null
  const stages = await fetchOrganizationStages({
    organizationId: organization._id,
  })

  return (
    <div className="p-4 flex flex-col gap-5">
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

      <LivestreamTable
        organizationSlug={params?.organization}
        streams={stages}
      />
    </div>
  )
}

export default Livestreams
