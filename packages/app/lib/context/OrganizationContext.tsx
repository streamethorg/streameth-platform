'use client';

import { createContext, useContext } from 'react';
import { IExtendedOrganization } from '../types';

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

type OrganizationContextType = {
  organization: IExtendedOrganization;
  organizationId: string;
  daysLeft: number;
  canUseFeatures: boolean;
  canCreateStages: boolean;
  subscriptionStatus: SubscriptionStatus;
  stagesStatus: StagesStatus;
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganizationContext must be used within a OrganizationContextProvider');
  }
  return context;
};

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export const OrganizationContextProvider = ({
  children,
  organization,
  daysLeft,
  canUseFeatures,
  canCreateStages,
  subscriptionStatus,
  stagesStatus,
}: {
  children: React.ReactNode;
  organization: IExtendedOrganization | null;
  daysLeft: number;
  canUseFeatures: boolean;
  canCreateStages: boolean;
  subscriptionStatus: SubscriptionStatus;
  stagesStatus: StagesStatus;
}) => {
  const organizationId = organization?._id.toString();
  
  if ( !organization || !organizationId) {
    throw new Error('User, organization, or organizationId is null');
  }

  console.log('stagesStatus', stagesStatus);
  return (
    <OrganizationContext.Provider
      value={{
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
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;
