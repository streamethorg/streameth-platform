'use server';
import {
  addOrganizationMember,
  createOrganization,
  deleteDestination,
  deleteTeamMember,
  joinOrganization,
  updateOrganization,
} from '@/lib/services/organizationService';
import { revalidateTag } from 'next/cache';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';
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
  revalidateTag(`organizations-${organization._id}`);
  if (!response) {
    throw new Error('Error creating organization');
  }
  return response;
};

export const joinOrganizationAction = async ({
  invitationCode,
  email,
}: {
  invitationCode: string;
  email: string;
}) => {
  try {
    const response = await joinOrganization({
      invitationCode,
      email,
    });
    if (!response) {
      throw new Error('Error joining organization');
    }

    return response;
  } catch (error) {
    console.error('Error in join organization action:', error);
    throw error;
  }
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
  revalidateTag(`organizations-${organization._id}`);
  if (!response) {
    throw new Error('Error updating organization');
  }
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
  revalidateTag(`organizations-${organizationId}`);
  if (!response) {
    throw new Error('Error adding organization member');
  }
  return response;
};

export const deleteTeamMemberAction = async ({
  memberEmail,
  organizationId,
}: {
  memberEmail: string;
  organizationId: string;
}) => {
  try {
    const response = await deleteTeamMember({
      memberEmail,
      organizationId,
    });
    revalidateTag(`organizations-${organizationId}`);
    return response;
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw new Error('Error deleting team member');
  }
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
  revalidateTag(`organizations-${organizationId}`);
  return response;
};
