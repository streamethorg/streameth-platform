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
import { LivestreamPageParams, eSort } from '@/lib/types'
import { fetchOrganizationStages } from '@/lib/services/stageService'
import LivestreamTable from './components/LivestreamTable'
import Image from 'next/image'
import { sortArray } from '@/lib/utils/utils'

const Livestreams = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null
  const stages = sortArray(
    await fetchOrganizationStages({
      organizationId: organization._id,
    }),
    searchParams.sort
  )

  return (
    <div className="flex flex-col bg-white h-full">
      <Card
        style={{
          backgroundImage: `url(/backgrounds/livestreamBg.png)`,
        }}
        className="shadow-none bg-cover bg-no-repeat p-4 border-none">
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

      {stages.length > 0 ? (
        <LivestreamTable
          organizationSlug={params?.organization}
          streams={stages}
        />
      ) : (
        <div>
          <div className="h-10 bg-white border-y border-muted flex justify-end"></div>
          <div className="flex h-96 bg-white gap-4 m-auto flex-col justify-center items-center">
            <Image
              src="/folder.png"
              width={150}
              height={150}
              alt="empty livestream"
            />
            <CardTitle className="font-semibold text-2xl">
              The livestream is empty
            </CardTitle>
            <CardDescription>
              Create your first livestream to get started!
            </CardDescription>
            <div className="w-fit mt-2">
              <CreateLivestreamModal organization={organization} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Livestreams
