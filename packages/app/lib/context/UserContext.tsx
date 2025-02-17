'use client';

import { createContext, useContext } from 'react';
import { IExtendedUserWithOrganizations } from '../types';

type UserContextType = {
  user: IExtendedUserWithOrganizations | null;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IExtendedUserWithOrganizations | null;
}) => {

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
