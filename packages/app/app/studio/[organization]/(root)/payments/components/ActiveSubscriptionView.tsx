import { AlertCircle } from 'lucide-react';
import { usePayment } from '@/lib/hooks/usePayment';
import { IExtendedOrganization } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { tierLimits } from '@/lib/utils/subscription';
import { MonthlySubscriptionTiers } from './MonthlySubscriptionTiers';

// Define tier information - ensure it matches with usePayment hook
const monthlyTiers = [
  {
    name: 'Clip Starter',
    price: 'Free',
    description: 'Perfect for beginners and testing',
    priceId: 'price_free_monthly',
    highlight: false,
    tierIndex: 0,
    tierKey: 'free'
  },
  {
    name: 'Creator',
    price: '$14.99',
    description: 'For content creators and streamers',
    priceId: 'price_creator_monthly', // Updated to match hooks
    highlight: false,
    tierIndex: 1,
    tierKey: 'creator'
  },
  {
    name: 'Content Pro',
    price: '$29.99',
    description: 'For professional content creators',
    priceId: 'price_pro_monthly', // Updated to match hooks
    highlight: true,
    tierIndex: 2,
    tierKey: 'pro'
  },
  {
    name: 'Studio',
    price: '$79.99',
    description: 'For businesses and teams',
    priceId: 'price_studio_monthly', // Updated to match hooks
    highlight: false,
    tierIndex: 3,
    tierKey: 'studio'
  },
];

// Define key features for each tier
const tierFeatures = {
  'free': ['5 videos', '1 seat', 'AI Clipping', 'No livestreaming'],
  'creator': ['10 videos', '1 seat', 'Livestreaming', 'AI Clipping'],
  'pro': ['25 videos', 'Unlimited seats', 'Multistreaming', 'Custom Channel'],
  'studio': ['50 videos', 'Unlimited seats', 'White-label', 'Priority Support']
};

interface ActiveSubscriptionViewProps {
  organization: IExtendedOrganization;
  organizationId: string;
  daysLeft: number;
  stagesStatus: {
    currentStages: number;
    paidStages: number;
    isOverLimit: boolean;
  };
}

export const ActiveSubscriptionView = ({
  organization,
  organizationId,
  daysLeft,
  stagesStatus,
}: ActiveSubscriptionViewProps) => {
  const { loading, handleSubscribe } = usePayment({ organizationId });
  const currentTier = organization.subscriptionTier || 'free';
  const currentTierIndex = monthlyTiers.findIndex(t => t.tierKey === currentTier);
  
  // Get the tier data for current tier
  const currentTierData = tierLimits[currentTier as keyof typeof tierLimits];
  
  // Format the next billing date properly with a fallback
  const nextBillingDate = organization.subscriptionPeriodEnd 
    ? new Date(organization.subscriptionPeriodEnd).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not available';

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Alerts Section - Shown at top for importance */}
      {(daysLeft <= 7 || stagesStatus.isOverLimit) && (
        <Card className="p-4 mb-6 shadow-none bg-amber-50 border-amber-200">
          <div className="flex flex-col space-y-2">
            {daysLeft <= 7 && (
              <div className="flex items-center text-amber-700">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Your subscription will renew on {nextBillingDate} ({daysLeft} days from now)</span>
              </div>
            )}
            
            {stagesStatus.isOverLimit && (
              <div className="flex items-center text-amber-700">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>All livestream slots used ({stagesStatus.currentStages}/{stagesStatus.paidStages})</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Current Subscription Card */}
      <Card className="p-5 shadow-none mb-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Current Plan: <span className="capitalize">{currentTier}</span></h1>
          <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Active
          </div>
        </div>
        
        {/* Add current plan price */}
        <div className="mb-4">
          <p className="font-medium text-md">
            {currentTier === 'free' 
              ? 'Free' 
              : `${monthlyTiers.find(t => t.tierKey === currentTier)?.price || '$0'}`}
            <span className="text-sm font-normal text-gray-600 ml-1">
              {currentTier !== 'free' && '/month'}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Videos:</span>
            <span className="font-medium">{currentTierData.maxVideoLibrarySize === Infinity ? 'Unlimited' : currentTierData.maxVideoLibrarySize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seats:</span>
            <span className="font-medium">{currentTierData.maxSeats === Infinity ? 'Unlimited' : currentTierData.maxSeats}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Multistream:</span>
            <span className="font-medium">{currentTierData.isMultistreamEnabled ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Custom Channel:</span>
            <span className="font-medium">{currentTierData.isCustomChannelEnabled ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Priority Support:</span>
            <span className="font-medium">{currentTierData.hasPrioritySupport ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div className="border-t pt-2">
          <p className="text-sm text-gray-700 font-medium">Subscription Details</p>
          <div className="text-xs text-gray-500 mt-1">
            <p>Next billing date: {nextBillingDate}</p>
            <p>Billing cycle: Monthly</p>
            {currentTier !== 'free' && <p>You can cancel or change your plan at any time</p>}
          </div>
        </div>
      </Card>

      {/* Upgrade/Downgrade Options Section */}
        <div className="mt-6">
          <MonthlySubscriptionTiers
            loading={loading}
            onSubscribe={handleSubscribe}
            currentTier={currentTier}
          />
        </div>
      </div>
  );
};