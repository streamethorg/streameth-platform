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
    daysLeft,
    subscriptionTier
  } = useOrganizationContext();

  // Wrap all content in a scrollable container
  const content = (
    <div className="h-full w-full overflow-y-auto">
      <div className="min-h-full w-full">
        {/* If never had a subscription or has free tier, show pricing tiers */}
        {(organization.subscriptionStatus === 'none' || 
          (organization.subscriptionTier === 'free' && organization.subscriptionStatus !== 'active')) && (
          <NewSubscriptionView organizationId={organizationId} />
        )}

        {/* If subscription has expired or failed, show expired notice + pricing tiers */}
        {(subscriptionStatus.hasExpired || subscriptionStatus.isFailed) && (
          <ExpiredSubscriptionView 
            organizationId={organizationId}
            stagesStatus={stagesStatus}
          />
        )}

        {/* If subscription is active - show current status + add resources card */}
        {subscriptionStatus.isActive && (
          <ActiveSubscriptionView 
            organization={organization}
            organizationId={organizationId}
            daysLeft={daysLeft}
            stagesStatus={stagesStatus}
          />
        )}

        {/* Has had subscription before but not active - show expired notice + pricing tiers */}
        {!subscriptionStatus.isActive && !subscriptionStatus.hasExpired && !subscriptionStatus.isFailed && 
         organization.subscriptionStatus !== 'none' && 
         !(organization.subscriptionTier === 'free' && organization.subscriptionStatus !== 'active') && (
          <ExpiredSubscriptionView 
            organizationId={organizationId}
            stagesStatus={stagesStatus}
            isCancelled={organization.subscriptionStatus === 'canceling'}
            subscriptionEndDate={organization.subscriptionPeriodEnd ? new Date(organization.subscriptionPeriodEnd) : undefined}
          />
        )}
      </div>
    </div>
  );

  return content;
}
