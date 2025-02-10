'use client';

import { createContext, useContext } from 'react';
import { IExtendedUser, IExtendedOrganization } from '../types';

type UserContextType = {
  user: IExtendedUser | null;
  organization: IExtendedOrganization | null;
  organizationId: string | null;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  const { user, organization, organizationId } = context;
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  if (!organization || !organizationId) {
    throw new Error('Organization not found');
  }
  return { user, organization, organizationId };
};

const UserContext = createContext<UserContextType>({
  user: null,
  organization: null,
  organizationId: null,
});

export const UserContextProvider = ({
  children,
  user,
  organization,
}: {
  children: React.ReactNode;
  user: IExtendedUser | null;
  organization: IExtendedOrganization | null;
}) => {
  const organizationId = organization?._id.toString() || null;

  return (
    <UserContext.Provider value={{ user, organization, organizationId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
