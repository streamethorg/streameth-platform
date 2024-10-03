'use server';
import {
  addOrganizationMember,
  createOrganization,
  deleteDestination,
  deleteTeamMember,
  updateOrganization,
} from '@/lib/services/organizationService';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';
import { redirect } from 'next/navigation';
import { IExtendedOrganization } from '../types';

export const createOrganizationAction = async ({
  organization,
}: {
  organization: IOrganization;
}) => {
  const response = await createOrganization({
    organization: {
      ...organization,
    },
  });

  if (!response) {
    throw new Error('Error creating organization');
  }
  revalidatePath('/studio');
  return response;
};

export const updateOrganizationAction = async ({
  organization,
}: {
  organization: IExtendedOrganization;
}) => {
  const response = await updateOrganization({
    organization: {
      ...organization,
    },
  });

  if (!response) {
    throw new Error('Error updating organization');
  }
  revalidatePath('/studio');
  return response;
};

export const addOrganizationMemberAction = async ({
  memberAddress,
  organizationId,
}: {
  organizationId: string;
  memberAddress: string;
}) => {
  const response = await addOrganizationMember({
    organizationId,
    memberAddress,
  });

  if (!response) {
    throw new Error('Error adding organization member');
  }
  revalidatePath('/studio');
  return response;
};

export const deleteTeamMemberAction = async ({
  memberWalletAddress,
  organizationId,
}: {
  memberWalletAddress: string;
  organizationId: string;
}) => {
  const response = await deleteTeamMember({
    memberWalletAddress,
    organizationId,
  });
  if (!response) {
    throw new Error('Error deleting team member action');
  }
  revalidatePath('/studio');
  return response;
};

export const deleteDestinationAction = async ({
  destinationId,
  organizationId,
}: {
  destinationId: string;
  organizationId: string;
}) => {
  const response = await deleteDestination({
    destinationId,
    organizationId,
  });
  if (!response) {
    throw new Error('Error deleting team member action');
  }
  revalidatePath('/studio');
  return response;
};
