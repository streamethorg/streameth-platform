import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ExpiredSubscriptionCard() {
  return (
    <Card className="p-6 bg-amber-50 mb-8">
      <div className="flex items-center gap-2 text-amber-600">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Your subscription has expired</p>
          <p className="text-sm">
            Purchase a new subscription to continue streaming.
          </p>
        </div>
      </div>
    </Card>
  );
} 