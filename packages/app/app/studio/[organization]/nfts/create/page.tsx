import React from 'react'
import CreateNFTForm from './components/CreateNFTForm'
import { fetchAllSessions } from '@/lib/data'
import { fetchOrganization } from '@/lib/services/organizationService'
import { INFTSessions } from '@/lib/types'
import { fetchOrganizationStages } from '@/lib/services/stageService'

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
  if (!organizationId) return null
  const stages = await fetchOrganizationStages({ organizationId })

  return (
    <div className="max-w-5xl mx-auto h-full">
      <CreateNFTForm
        videos={videos as INFTSessions[]}
        stages={stages as INFTSessions[]}
        organizationId={organizationId}
        organizationSlug={params.organization}
        type={type}
      />
    </div>
  )
}

export default CreateNFT
