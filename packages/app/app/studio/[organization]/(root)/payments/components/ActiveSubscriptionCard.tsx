import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { IExtendedOrganization } from '@/lib/types';


export function ActiveSubscriptionCard({
  organization,
  expiryDate,
  daysLeft,
}: {
  organization: IExtendedOrganization;
  expiryDate: Date;
  daysLeft: number;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Active Subscription</h1>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Active
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Stages</span>
          <span className="font-medium">{organization.paidStages} stages</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Streaming Days</span>
          <span className="font-medium">{organization.streamingDays} days</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Expires</span>
          <span className="font-medium">
            {expiryDate.toLocaleDateString()} ({daysLeft} days left)
          </span>
        </div>

        {daysLeft <= 2 && (
          <div className="flex items-center gap-2 text-amber-600 mt-4 p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">Your subscription will expire soon.</span>
          </div>
        )}
      </div>
    </Card>
  );
}
