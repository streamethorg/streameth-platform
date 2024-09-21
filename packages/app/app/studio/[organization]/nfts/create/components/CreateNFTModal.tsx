import React from 'react';
import CreateNFTForm from './CreateNFTForm';
import { fetchAllSessions } from '@/lib/data';
import { fetchOrganization } from '@/lib/services/organizationService';
import { INFTSessions } from '@/lib/types';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import { NftCollectionType } from 'streameth-new-server/src/interfaces/nft.collection.interface';

const CreateNFTModal = async ({
  organization,
  type,
}: {
  organization: string;
  type: string;
}) => {
  const organizationId = (
    await fetchOrganization({ organizationSlug: organization })
  )?._id;
  const videos = (
    await fetchAllSessions({
      organizationSlug: organization,
      onlyVideos: true,
    })
  ).sessions;
  if (!organizationId || !type) return null;
  const stages = await fetchOrganizationStages({ organizationId });

  return (
    <CreateNFTForm
      videos={videos as INFTSessions[]}
      stages={stages as unknown as INFTSessions[]}
      organizationId={organizationId}
      organizationSlug={organization}
      type={type as NftCollectionType}
    />
  );
};

export default CreateNFTModal;
