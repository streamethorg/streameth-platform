'use client';

import { useOrganization } from './useOrganization';

interface SubscriptionStatus {
  isActive: boolean;
  daysLeft: number;
  hasExpired: boolean;
  isProcessing: boolean;
  isPending: boolean;
  isFailed: boolean;
  hasAvailableStages: boolean;
}

export const useSubscription = (organizationId: string) => {
  const { organization, loading, error } = useOrganization(organizationId);

  if (loading || error || !organization) {
    return {
      canUseFeatures: false,
      canCreateStages: false,
      isLoading: loading,
      error,
      organizationSlug: '',
      status: {
        isActive: false,
        daysLeft: 0,
        hasExpired: true,
        isProcessing: false,
        isPending: false,
        isFailed: false,
        hasAvailableStages: false
      } as SubscriptionStatus,
    };
  }

  const status: SubscriptionStatus = {
    isActive: organization.paymentStatus === 'active',
    isProcessing: organization.paymentStatus === 'processing',
    isPending: organization.paymentStatus === 'pending',
    isFailed: organization.paymentStatus === 'failed',
    daysLeft: 0,
    hasExpired: true,
    hasAvailableStages: typeof organization.currentStages === 'undefined' || 
                       typeof organization.paidStages === 'undefined' || 
                       organization.currentStages < organization.paidStages
  };

  if (organization.expirationDate) {
    const expiryDate = new Date(organization.expirationDate);
    const now = new Date();
    status.daysLeft = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
    status.hasExpired = status.daysLeft <= 0;
  }

  // Base feature access - only checks subscription status and expiry
  const canUseFeatures = status.isActive && !status.hasExpired;
  
  // Stage creation - checks subscription, expiry AND stage limits
  const canCreateStages = canUseFeatures && status.hasAvailableStages;

  return {
    canUseFeatures,
    canCreateStages,
    isLoading: loading,
    error,
    organizationSlug: organization.slug || '',
    status,
  };
};
