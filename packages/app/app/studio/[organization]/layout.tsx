import { studioPageParams } from '@/lib/types';
import React from 'react';
import { fetchUserAction } from '@/lib/actions/users';
import { hasOrganization } from '@/lib/utils/utils';
import Support from '@/components/misc/Support';
import { fetchOrganization } from '@/lib/services/organizationService';
import { UserContextProvider } from '@/lib/context/UserContext';
import { redirect } from 'next/navigation';
import { IExtendedOrganization } from '@/lib/types';
import { SubscriptionStatus } from '@/lib/context/UserContext';
const calculateOrganizationStatus = (
  organization: IExtendedOrganization
): SubscriptionStatus => {
  let daysLeft = 0;
  let hasExpired = true;

  if (organization.expirationDate) {
    const expiryDate = new Date(organization.expirationDate);
    const now = new Date();
    daysLeft = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
    hasExpired = daysLeft <= 0;
  }

  return {
    isActive: organization.paymentStatus === 'active',
    isProcessing: organization.paymentStatus === 'processing',
    isPending: organization.paymentStatus === 'pending',
    isFailed: organization.paymentStatus === 'failed',
    daysLeft,
    hasExpired,
    hasAvailableStages:
      typeof organization.currentStages === 'undefined' ||
      typeof organization.paidStages === 'undefined' ||
      organization.currentStages < organization.paidStages,
  };
};

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: studioPageParams['params'];
}) => {
  const userData = await fetchUserAction();
  const currentOrganization = await fetchOrganization({
    organizationId: params.organization,
  });

  if (
    !userData ||
    !currentOrganization ||
    !hasOrganization(userData?.organizations, currentOrganization.slug)
  ) {
    redirect('/studio');
  }

  const status = calculateOrganizationStatus(currentOrganization);
  const canUseFeatures = status.isActive && !status.hasExpired;
  const canCreateStages = canUseFeatures && status.hasAvailableStages;
  const stagesStatus = {
    currentStages: currentOrganization.currentStages || 0,
    paidStages: currentOrganization.paidStages || 0,
    isOverLimit: !status.hasAvailableStages,
  };
  return (
    <UserContextProvider
      user={userData}
      organization={currentOrganization}
      daysLeft={status.daysLeft}
      canUseFeatures={canUseFeatures}
      canCreateStages={canCreateStages}
      subscriptionStatus={status}
      stagesStatus={stagesStatus}
    >
      {children}
      <Support />
    </UserContextProvider>
  );
};

export default Layout;
