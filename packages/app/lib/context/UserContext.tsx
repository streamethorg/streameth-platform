'use client';

import { createContext, useContext } from 'react';
import { IExtendedUser, IExtendedOrganization } from '../types';

export interface SubscriptionStatus {
  isActive: boolean;
  daysLeft: number;
  hasExpired: boolean;
  isProcessing: boolean;
  isPending: boolean;
  isFailed: boolean;
  hasAvailableStages: boolean;
}

export interface StagesStatus {
  currentStages: number;
  paidStages: number;
  isOverLimit: boolean;
}

type UserContextType = {
  user: IExtendedUser;
  organization: IExtendedOrganization;
  organizationId: string;
  daysLeft: number;
  canUseFeatures: boolean;
  canCreateStages: boolean;
  subscriptionStatus: SubscriptionStatus;
  stagesStatus: StagesStatus;
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
  organization,
  daysLeft,
  canUseFeatures,
  canCreateStages,
  subscriptionStatus,
  stagesStatus,
}: {
  children: React.ReactNode;
  user: IExtendedUser | null;
  organization: IExtendedOrganization | null;
  daysLeft: number;
  canUseFeatures: boolean;
  canCreateStages: boolean;
  subscriptionStatus: SubscriptionStatus;
  stagesStatus: StagesStatus;
}) => {
  const organizationId = organization?._id.toString();

  if (!user || !organization || !organizationId) {
    throw new Error('User, organization, or organizationId is null');
  }

  return (
    <UserContext.Provider
      value={{
        user,
        organization,
        organizationId,
        daysLeft,
        canUseFeatures,
        canCreateStages,
        subscriptionStatus,
        stagesStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
