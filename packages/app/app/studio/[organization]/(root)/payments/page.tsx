'use client';

import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { NewSubscriptionView } from './components/NewSubscriptionView';
import { ActiveSubscriptionView } from './components/ActiveSubscriptionView';
import { ExpiredSubscriptionView } from './components/ExpiredSubscriptionView';

export default function PaymentsPage() {
  const { 
    organization, 
    organizationId, 
    subscriptionStatus, 
    stagesStatus,
    daysLeft 
  } = useOrganizationContext();

  // If never had a subscription, show pricing tiers
  if (organization.paymentStatus === 'none' && !organization.expirationDate) {
    return <NewSubscriptionView organizationId={organizationId} />;
  }

  // If subscription is active
  if (subscriptionStatus.isActive) {
    // If subscription has expired, show expired notice + pricing tiers
    if (subscriptionStatus.hasExpired) {
      return <ExpiredSubscriptionView 
        organizationId={organizationId}
        stagesStatus={stagesStatus}
      />;
    }

    // Active subscription - show current status + add resources card
    return <ActiveSubscriptionView 
      organization={organization}
      organizationId={organizationId}
      daysLeft={daysLeft}
      stagesStatus={stagesStatus}
    />;
  }

  // Has had subscription before but not active - show expired notice + pricing tiers
  return <ExpiredSubscriptionView 
    organizationId={organizationId}
    stagesStatus={stagesStatus}
  />;
}
