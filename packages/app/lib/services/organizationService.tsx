import { apiUrl } from '@/lib/utils/utils';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';
import { IExtendedOrganization, IExtendedUser } from '../types';
import { cookies } from 'next/headers';

export async function fetchOrganization({
  organizationSlug,
  organizationId,
}: {
  organizationSlug?: string;
  organizationId?: string;
}): Promise<IExtendedOrganization | null> {
  try {
    if (!organizationSlug && !organizationId) {
      return null;
    }
    const response = await fetch(
      `${apiUrl()}/organizations/${
        organizationId ? organizationId : organizationSlug
      }`
    );
    const data = (await response.json()).data;

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function fetchOrganizations(): Promise<IExtendedOrganization[]> {
  try {
    const response = await fetch(`${apiUrl()}/organizations`);
    return (await response.json()).data ?? [];
  } catch (e) {
    console.log(e);
    throw 'Error fetching organizations';
  }
}

export async function createOrganization({
  organization,
  authToken,
}: {
  organization: IOrganization;
  authToken: string;
}): Promise<IOrganization> {
  if (!authToken) {
    throw 'No auth token';
  }

  try {
    const response = await fetch(`${apiUrl()}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
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
  authToken,
}: {
  organization: IExtendedOrganization;
  authToken: string;
}): Promise<IOrganization> {
  if (!authToken) {
    throw 'No auth token';
  }
  const modifiedObject = (({ _id, ...rest }) => rest)(organization);

  try {
    const response = await fetch(
      `${apiUrl()}/organizations/${organization._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(modifiedObject),
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
  authToken,
}: {
  organizationId: string;
  memberAddress: string;
  authToken: string;
}): Promise<IOrganization> {
  if (!authToken) {
    throw 'No auth token';
  }

  try {
    const response = await fetch(
      `${apiUrl()}/organizations/member/${organizationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
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
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw 'No auth token';
  }

  try {
    const response = await fetch(
      `${apiUrl()}/organizations/member/${organizationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return (await response.json()).data ?? [];
  } catch (e) {
    console.log(e);
    throw 'Error fetching organizations members';
  }
}

export async function deleteTeamMember({
  memberWalletAddress,
  authToken,
  organizationId,
}: {
  memberWalletAddress: string;
  authToken: string;
  organizationId?: string;
}): Promise<IExtendedUser> {
  try {
    const response = await fetch(
      `${apiUrl()}/organizations/member/${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ walletAddress: memberWalletAddress }),
      }
    );

    if (!response.ok) {
      throw 'Error deleting team member';
    }
    return await response.json();
  } catch (e) {
    console.log('error in delete team member', e);
    throw e;
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
    const authToken = cookies().get('user-session')?.value;
    if (!authToken) {
      throw 'No auth token';
    }

    const response = await fetch(
      `${apiUrl()}/organizations/${organizationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
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
  authToken,
  organizationId,
}: {
  destinationId: string;
  authToken: string;
  organizationId?: string;
}): Promise<IExtendedOrganization> {
  try {
    const response = await fetch(
      `${apiUrl()}/organizations/socials/${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
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
