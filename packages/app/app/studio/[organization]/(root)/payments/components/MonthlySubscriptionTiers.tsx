import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// All possible features across all tiers
const allFeatures = [
  { 
    id: 'video_library',
    label: (tier: number) => {
      if (tier === 0) return 'Up to 5 videos in library';
      if (tier === 1) return 'Up to 10 videos in library';
      if (tier === 2) return 'Up to 25 videos in library';
      return 'Up to 50 videos in library';
    }
  },
  {
    id: 'livestreaming',
    label: () => 'Livestreaming',
    available: [false, true, true, true]
  },
  {
    id: 'multistreaming',
    label: () => 'Multistreaming',
    available: [false, false, true, true]
  },
  {
    id: 'seats',
    label: (tier: number) => {
      if (tier === 0) return '1 seat';
      if (tier === 1) return '1 seat';
      return 'Unlimited seats';
    }
  },
  {
    id: 'ai_clipping',
    label: () => 'AI clipping',
    available: [true, true, true, true]
  },
  {
    id: 'custom_channel',
    label: () => 'Custom channel page',
    available: [false, false, true, true]
  },
  {
    id: 'priority_support',
    label: () => 'Priority support',
    available: [false, false, false, true]
  }
];

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
    priceId: 'price_creator_monthly',
    highlight: false,
    tierIndex: 1,
    tierKey: 'creator'
  },
  {
    name: 'Content Pro',
    price: '$29.99',
    description: 'For professional content creators',
    priceId: 'price_pro_monthly',
    highlight: true,
    tierIndex: 2,
    tierKey: 'pro'
  },
  {
    name: 'Studio',
    price: '$79.99',
    description: 'For businesses and teams',
    priceId: 'price_studio_monthly',
    highlight: false,
    tierIndex: 3,
    tierKey: 'studio'
  },
];

interface MonthlySubscriptionTiersProps {
  loading: boolean;
  onSubscribe: (priceId: string) => void;
  currentTier?: string; // Add current tier prop
  showOnlyUpgradeOptions?: boolean; // Add option to show only upgrade options
}

export function MonthlySubscriptionTiers({
  loading,
  onSubscribe,
  currentTier = 'none',
  showOnlyUpgradeOptions = false,
}: MonthlySubscriptionTiersProps) {
  // Get tier index for the current tier to determine which are upgrades
  const currentTierIndex = monthlyTiers.findIndex(t => t.tierKey === currentTier);
  
  // Filter tiers based on showOnlyUpgradeOptions
  const tiersToShow = showOnlyUpgradeOptions 
    ? monthlyTiers.filter(tier => {
        // For free tier, show all paid tiers
        if (currentTier === 'free') {
          return tier.tierKey !== 'free';
        }
        // For other tiers, show only higher-tier options
        return tier.tierIndex > currentTierIndex;
      })
    : monthlyTiers;
    
  // If no tiers to show (at highest tier already), display a message
  if (tiersToShow.length === 0 && showOnlyUpgradeOptions) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">You&apos;re already on our highest tier!</h3>
        <p className="mt-2 text-gray-600">You have access to all available features.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 ${
      tiersToShow.length === 1 ? 'md:grid-cols-1 max-w-lg' :
      tiersToShow.length === 2 ? 'md:grid-cols-2 max-w-3xl' :
      tiersToShow.length === 3 ? 'md:grid-cols-3 max-w-5xl' : 'md:grid-cols-2 lg:grid-cols-4 max-w-6xl'
    } gap-4 mx-auto place-content-center`}>
      {tiersToShow.map((tier) => {
        // Sort features - available ones first, unavailable ones last
        const sortedFeatures = [...allFeatures].sort((a, b) => {
          const aAvailable = a.available ? a.available[tier.tierIndex] : true;
          const bAvailable = b.available ? b.available[tier.tierIndex] : true;
          
          if (aAvailable && !bAvailable) return -1;
          if (!aAvailable && bAvailable) return 1;
          return 0;
        });
        
        // Check if this is the current active tier
        const isActive = currentTier === tier.tierKey;
        
        return (
          <div
            key={tier.name}
            className={`relative border rounded-lg overflow-hidden flex flex-col bg-white ${
              tier.highlight 
                ? 'border-primary shadow-md' 
                : isActive
                ? 'border-green-500 shadow-md'
                : 'border-gray-200'
            }`}
          >
            {tier.highlight && !isActive && (
              <div className="bg-primary text-white text-xs font-semibold py-1 text-center">
                MOST POPULAR
              </div>
            )}
            
            {isActive && (
              <div className="bg-green-500 text-white text-xs font-semibold py-1 text-center">
                CURRENT PLAN
              </div>
            )}
            
            <div className="p-5 flex-1">
              <h2 className="text-xl font-bold">{tier.name}</h2>
              <p className="text-gray-500 text-sm mt-1 mb-4">{tier.description}</p>
              <div className="mb-5">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.price !== 'Free' && (
                  <span className="text-gray-500 ml-1">/month</span>
                )}
                {tier.price !== 'Free' && (
                  <p className="text-xs text-gray-500 mt-1">Billed monthly. Cancel anytime.</p>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {sortedFeatures.map((feature) => {
                  const isAvailable = feature.available ? 
                    feature.available[tier.tierIndex] : 
                    true;
                  
                  return (
                    <li key={feature.id} className="flex items-start">
                      {isAvailable ? (
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${isAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                        {typeof feature.label === 'function' 
                          ? feature.label(tier.tierIndex) 
                          : feature.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="p-5 pt-0">
              <Button
                onClick={() => onSubscribe(tier.priceId)}
                disabled={loading || (isActive && tier.tierKey !== 'free')}
                variant={tier.tierKey === 'free' ? "outline" : isActive ? "outline" : "primary"}
                className="w-full mt-6"
              >
                {loading
                  ? 'Processing...'
                  : isActive && tier.tierKey === 'free'
                  ? 'Reactivate Free Tier'
                  : isActive
                  ? 'Current Plan'
                  : tier.price === 'Free'
                  ? 'Get Started'
                  : 'Subscribe'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}