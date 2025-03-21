import { apiUrl } from '@/lib/utils/utils';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';
import { IExtendedOrganization, IExtendedUser } from '../types';
import { fetchClient } from './fetch-client';

export async function fetchOrganization({
  organizationId,
}: {
  organizationId: string;
}): Promise<IExtendedOrganization | null> {
  try {
    if (!organizationId) {
      return null;
    }
    const response = await fetch(`${apiUrl()}/organizations/${organizationId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: [`organizations-${organizationId}`] },
    });
    const data = (await response.json()).data;

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function activateFreeTier({
  organizationId,
}: {
  organizationId: string;
}): Promise<IExtendedOrganization> {
  try {
    const response = await fetchClient(
      `${apiUrl()}/organizations/subscription/free/${organizationId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      return (await response.json()).data;
    } else {
      throw await response.json();
    }
  } catch (e) {
    console.error('Unexpected error activating free tier:', e);
    throw e;
  }
}

export async function fetchOrganizations(): Promise<IExtendedOrganization[]> {
  try {
    const response = await fetchClient(`${apiUrl()}/organizations`, {
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: [`organizations`] },
    });
    return (await response.json()).data ?? [];
  } catch (e) {
    console.log(e);
    throw 'Error fetching organizations';
  }
}

export async function createOrganization({
  organization,
}: {
  organization: IOrganization;
}): Promise<IOrganization> {
  try {
    const response = await fetchClient(`${apiUrl()}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organization),
    });

    if (response.ok) {
      return (await response.json()).data;
    } else {
      throw await response.json();
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    throw e;
  }
}

export async function updateOrganization({
  organization,
}: {
  organization: IExtendedOrganization;
}): Promise<IOrganization> {
  const modifiedObject = (({ _id, ...rest }) => rest)(organization);

  try {
    const response = await fetchClient(
      `${apiUrl()}/organizations/${organization._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedObject),
        next: { tags: [`organizations-${organization._id}`] },
      }
    );

    if (response.ok) {
      return (await response.json()).data;
    } else {
      throw await response.json();
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    throw e;
  }
}

export async function addOrganizationMember({
  organizationId,
  memberAddress,
}: {
  organizationId: string;
  memberAddress: string;
}): Promise<IOrganization> {
  try {
    const response = await fetchClient(
      `${apiUrl()}/organizations/member/${organizationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: memberAddress }),
      }
    );

    if (response.ok) {
      return (await response.json()).message;
    } else {
      throw await response.json();
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    throw e;
  }
}

export async function fetchOrganizationMembers({
  organizationId,
}: {
  organizationId: string;
}): Promise<IExtendedUser[]> {
  try {
    const response = await fetchClient(
      `${apiUrl()}/organizations/member/${organizationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
        next: { tags: [`organizations-${organizationId}`] },
      }
    );

    return (await response.json()).data ?? [];
  } catch (e) {
    console.log(e);
    throw 'Error fetching organizations members';
  }
}

export async function deleteTeamMember({
  memberEmail,
  organizationId,
}: {
  memberEmail: string;
  organizationId: string;
}): Promise<IExtendedUser> {
  try {
    const response = await fetchClient(
      `${apiUrl()}/organizations/member/${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: memberEmail }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error deleting team member');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in delete team member:', error);
    throw error;
  }
}

export async function fetchOrganizationSocials({
  organizationId,
}: {
  organizationSlug?: string;
  organizationId?: string;
}): Promise<IExtendedOrganization | null> {
  try {
    if (!organizationId) {
      return null;
    }

    const response = await fetchClient(
      `${apiUrl()}/organizations/${organizationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = (await response.json()).data;

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function deleteDestination({
  destinationId,

  organizationId,
}: {
  destinationId: string;

  organizationId?: string;
}): Promise<IExtendedOrganization> {
  try {
    const response = await fetchClient(
      `${apiUrl()}/organizations/socials/${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destinationId }),
      }
    );

    if (!response.ok) {
      throw 'Error deleting destination';
    }
    return await response.json();
  } catch (e) {
    console.log('error in delete destination', e);
    throw e;
  }
}

export async function joinOrganization({
  invitationCode,
  email,
}: {
  invitationCode: string;
  email: string;
}): Promise<IOrganization> {
  try {
    const response = await fetchClient(`${apiUrl()}/organizations/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invitationCode, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join organization');
    }

    return (await response.json()).data;
  } catch (error) {
    console.error('Error joining organization:', error);
    throw error;
  }
}
