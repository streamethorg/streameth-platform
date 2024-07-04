import React from 'react'
import CreateNFTForm from './components/CreateNFTForm'
import { fetchAllSessions } from '@/lib/data'
import { fetchOrganization } from '@/lib/services/organizationService'
import { INFTSessions } from '@/lib/types'
import { fetchOrganizationStages } from '@/lib/services/stageService'
import { NftCollectionType } from 'streameth-new-server/src/interfaces/nft.collection.interface'

const CreateNFT = async ({
  params,
  searchParams,
}: {
  params: { organization: string }
  searchParams: { type: string }
}) => {
  const { type } = searchParams
  const organizationId = (
    await fetchOrganization({ organizationSlug: params.organization })
  )?._id
  const videos = (
    await fetchAllSessions({
      organizationSlug: params.organization,
      onlyVideos: true,
    })
  ).sessions
  if (!organizationId || !type) return null
  const stages = await fetchOrganizationStages({ organizationId })

  return (
    <div className="mx-auto h-full max-w-5xl overflow-auto">
      <CreateNFTForm
        videos={videos as INFTSessions[]}
        stages={stages as INFTSessions[]}
        organizationId={organizationId}
        organizationSlug={params.organization}
        type={type as NftCollectionType}
      />
    </div>
  )
}

export default CreateNFT
