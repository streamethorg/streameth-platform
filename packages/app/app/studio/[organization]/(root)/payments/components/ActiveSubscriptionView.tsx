import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePayment } from '@/lib/hooks/usePayment';
import { IExtendedOrganization } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tierLimits } from '@/lib/utils/subscription';
import { useState } from 'react';

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
    highlight: true,
    tierIndex: 1,
    tierKey: 'creator'
  },
  {
    name: 'Content Pro',
    price: '$29.99',
    description: 'For professional content creators',
    priceId: 'price_pro_monthly', // Updated to match hooks
    highlight: false,
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
  'creator': ['50 videos', '2 seats', 'Livestreaming', 'AI Clipping'],
  'pro': ['100 videos', '5 seats', 'Multistreaming', 'Custom Channel'],
  'studio': ['Unlimited videos', 'Unlimited seats', 'White-label', 'Priority Support']
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
  
  // State to track which tier is currently displayed in the carousel
  const [displayTierIndex, setDisplayTierIndex] = useState(
    currentTierIndex < monthlyTiers.length - 1 ? currentTierIndex + 1 : currentTierIndex
  );
  
  // Get the tier data for current tier
  const currentTierData = tierLimits[currentTier as keyof typeof tierLimits];
  const displayTier = monthlyTiers[displayTierIndex];
  
  // Navigation functions for carousel
  const goToNextTier = () => {
    if (displayTierIndex < monthlyTiers.length - 1) {
      setDisplayTierIndex(displayTierIndex + 1);
    }
  };
  
  const goToPrevTier = () => {
    if (displayTierIndex > currentTierIndex + 1) {
      setDisplayTierIndex(displayTierIndex - 1);
    }
  };

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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Current subscription info */}
        <Card className="p-5 flex-1 shadow-none">
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

        {/* Right side - Upgrade card with carousel */}
        {currentTierIndex < monthlyTiers.length - 1 ? (
          <Card className="p-5 flex-1 shadow-none border-primary">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <button 
                  onClick={goToPrevTier} 
                  disabled={displayTierIndex <= currentTierIndex + 1}
                  className="p-1 mr-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous tier"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h1 className="text-lg font-bold">{displayTier.name}</h1>
                <button 
                  onClick={goToNextTier} 
                  disabled={displayTierIndex >= monthlyTiers.length - 1}
                  className="p-1 ml-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next tier"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {displayTier.price}/month
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-3">{displayTier.description}</p>
              
              <h3 className="font-medium text-sm mb-2">Key features:</h3>
              <ul className="space-y-1 mb-4 text-sm">
                {tierFeatures[displayTier.tierKey as keyof typeof tierFeatures].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-xs text-gray-500 mb-4">
                Upgrading to {displayTier.name} will be effective immediately. You&apos;ll be billed the new rate at your next billing cycle.
              </p>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center mb-4">
              {monthlyTiers.slice(currentTierIndex + 1).map((tier, idx) => (
                <button
                  key={tier.tierKey}
                  onClick={() => setDisplayTierIndex(currentTierIndex + 1 + idx)}
                  className={`mx-1 rounded-full ${
                    displayTierIndex === currentTierIndex + 1 + idx
                      ? 'w-2 h-2 bg-primary'
                      : 'w-1.5 h-1.5 bg-gray-300'
                  }`}
                  aria-label={`Show ${tier.name} tier`}
                />
              ))}
            </div>

            <Button
              onClick={() => handleSubscribe(displayTier.priceId)}
              disabled={loading}
              variant="primary"
              className="w-full text-sm py-1.5"
              size="sm"
            >
              {loading ? 'Processing...' : `Upgrade to ${displayTier.name}`}
            </Button>
          </Card>
        ) : (
          <Card className="p-5 flex-1 shadow-none">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold">Maximum Plan</h1>
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Studio
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">
              You&apos;re on our highest tier plan with all available features unlocked.
            </p>
            
            <ul className="space-y-1 mb-4 text-sm">
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                <span>Unlimited videos</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                <span>Unlimited seats</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                <span>All premium features</span>
              </li>
            </ul>
            
            <Button
              variant="outline"
              className="w-full text-sm py-1.5"
              disabled
              size="sm"
            >
              Maximum Plan
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};