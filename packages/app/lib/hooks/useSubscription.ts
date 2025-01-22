'use client';

import { useOrganization } from './useOrganization';

interface SubscriptionStatus {
  isActive: boolean;
  daysLeft: number;
  hasExpired: boolean;
  isProcessing: boolean;
  isPending: boolean;
  isFailed: boolean;
}

export const useSubscription = (organizationId: string) => {
  const { organization, loading, error } = useOrganization(organizationId);

  if (loading || error || !organization) {
    return {
      canUseFeatures: false,
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
  };

  if (organization.expirationDate) {
    const expiryDate = new Date(organization.expirationDate);
    const now = new Date();
    status.daysLeft = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
    status.hasExpired = status.daysLeft <= 0;
  }

  // Can use features if subscription is active and not expired
  const canUseFeatures = status.isActive && !status.hasExpired;

  return {
    canUseFeatures,
    isLoading: loading,
    error,
    organizationSlug: organization.slug || '',
    status,
  };
};
