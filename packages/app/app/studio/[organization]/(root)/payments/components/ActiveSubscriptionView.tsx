import { AlertCircle, FileText, Download, ExternalLink, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { usePayment } from '@/lib/hooks/usePayment';
import { IExtendedOrganization } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { tierLimits } from '@/lib/utils/subscription';
import { MonthlySubscriptionTiers } from './MonthlySubscriptionTiers';
import { Button } from '@/components/ui/button';

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
  'pro': ['25 videos', 'Unlimited seats', 'Livestreaming', 'Multistreaming', 'Custom Channel'],
  'studio': ['50 videos', 'Unlimited seats', 'Livestreaming', 'Multistreaming', 'Custom Channel', 'Priority Support']
};

// Invoice interface definition
interface InvoiceData {
  hostedInvoiceUrl: string;
  invoicePdf: string;
  number: string;
  total: number;
  currency: string;
  status: string;
  paidAt: number | null;
  receiptNumber: string | null;
}

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

  // Use real invoice data if available, otherwise use mock data for demonstration
  const invoiceData = organization.latestInvoice || {
    id: "in_1R1qkxGMvwR8KL2AtuhNbcOo",
    hostedInvoiceUrl: "https://invoice.stripe.com/i/acct_1Q4JfJGMvwR8KL2A/test_YWNjdF8xUTRKZkpHTXZ3UjhLTDJBLF9SdmlCbnlEeUJMZk1vbGEyWlR3cHJtM2lKQjZwTWdVLDEzMjMzMjM4Mw0200HvFB0bjq?s=ap",
    invoicePdf: "https://pay.stripe.com/invoice/acct_1Q4JfJGMvwR8KL2A/test_YWNjdF8xUTRKZkpHTXZ3UjhLTDJBLF9SdmlCbnlEeUJMZk1vbGEyWlR3cHJtM2lKQjZwTWdVLDEzMjMzMjM4Mw0200HvFB0bjq/pdf?s=ap",
    number: "3EF67D63-0004",
    total: 2999,
    currency: "usd",
    status: "paid",
    paidAt: 1741791582,
    receiptNumber: null,
    createdAt: 1741791579
  };

  // Format currency for display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  // Format payment date
  const formatPaymentDate = (timestamp: number | null) => {
    if (!timestamp) return 'Not available';
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Alerts Section - Shown at top for importance */}
      {((currentTier !== 'free' && daysLeft <= 7) || stagesStatus.isOverLimit) && (
        <Card className="p-3 mb-4 shadow-none bg-amber-50 border-amber-200">
          <div className="flex flex-col space-y-1">
            {currentTier !== 'free' && daysLeft <= 7 && (
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

      {/* Current Subscription Card - More compact design */}
      <Card className="overflow-hidden mb-6 border border-gray-200 shadow-sm">
        {/* Colored header section */}
        <div className="bg-gradient-to-r from-primary/90 to-primary p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold capitalize">{monthlyTiers.find(t => t.tierKey === currentTier)?.name || currentTier}</h1>
              <p className="text-white/80 text-sm">
                {currentTier === 'free' 
                  ? 'Free Plan' 
                  : `${monthlyTiers.find(t => t.tierKey === currentTier)?.price || '$0'}/month`}
              </p>
            </div>
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Active
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-4">
          {/* Features grid - more compact */}
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Plan Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Videos</p>
                <p className="font-medium">{currentTierData.maxVideoLibrarySize === Infinity ? 'Unlimited' : currentTierData.maxVideoLibrarySize}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Seats</p>
                <p className="font-medium">{currentTierData.maxSeats === Infinity ? 'Unlimited' : currentTierData.maxSeats}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Livestreaming</p>
                <p className="font-medium">{currentTierData.isLivestreamingEnabled ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Multistreaming</p>
                <p className="font-medium">{currentTierData.isMultistreamEnabled ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Custom Channel</p>
                <p className="font-medium">{currentTierData.isCustomChannelEnabled ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Priority Support</p>
                <p className="font-medium">{currentTierData.hasPrioritySupport ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Billing information and Invoice - only show for paid tiers */}
          {currentTier !== 'free' && (
            <div className="border-t pt-3">
              <div className="flex flex-col sm:flex-row">
                {/* Billing information - left side */}
                <div className="sm:w-1/2 sm:pr-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm">Next billing date: <span className="font-medium">{nextBillingDate}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm">Billing cycle: <span className="font-medium">Monthly</span></p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic pl-6">You can cancel or change your plan at any time</p>
                  </div>
                </div>
                
                {/* Vertical separator - only visible on sm screens and up */}
                <div className="hidden sm:block sm:w-px sm:bg-gray-200 sm:mx-4 sm:self-stretch"></div>
                
                {/* Latest Invoice - right side */}
                <div className="sm:w-1/2 sm:pl-4 mt-4 sm:mt-0">
                  {invoiceData ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div className="mb-2 sm:mb-0">
                          <p className="text-sm font-medium">Invoice #{invoiceData.number}</p>
                          <p className="text-xs text-gray-500">
                            {formatPaymentDate(invoiceData.paidAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(invoiceData.total, invoiceData.currency)}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            Status: <span className="text-green-600 font-medium">{invoiceData.status}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={() => window.open(invoiceData.hostedInvoiceUrl, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View Invoice
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={() => window.open(invoiceData.invoicePdf, '_blank')}
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">No invoice information available yet.</p>
                      <p className="text-xs text-gray-500 mt-1">Your first invoice will appear here after your payment is processed.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Upgrade/Downgrade Options Section */}
      <div className="mt-4">
        <MonthlySubscriptionTiers
          loading={loading}
          onSubscribe={handleSubscribe}
          currentTier={currentTier}
        />
      </div>
    </div>
  );
};