import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResourceCounter } from './ResourceCounter';

interface AddResourcesCardProps {
  streamingDays: number;
  numberOfStages: number;
  loading: boolean;
  totalPrice: number;
  onIncrementDays: () => void;
  onDecrementDays: () => void;
  onIncrementStages: () => void;
  onDecrementStages: () => void;
  onSubscribe: () => void;
}

export function AddResourcesCard({
  streamingDays,
  numberOfStages,
  loading,
  totalPrice,
  onIncrementDays,
  onDecrementDays,
  onIncrementStages,
  onDecrementStages,
  onSubscribe,
}: AddResourcesCardProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add More Resources</h2>
      <p className="text-gray-600 mb-6">
        Extend your current subscription by adding more days or stages.
      </p>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Additional Resources</span>
              <div>
                <span className="text-2xl font-bold">${totalPrice}</span>
                {(streamingDays > 0 || numberOfStages > 0) && totalPrice === 250}
              </div>
            </div>

            <div className="space-y-4">
              <ResourceCounter
                label="Additional days"
                value={streamingDays}
                onIncrement={onIncrementDays}
                onDecrement={onDecrementDays}
                helpText={streamingDays > 0 ? `Extends expiration date by ${streamingDays} day${streamingDays > 1 ? 's' : ''}` : undefined}
              />

              <ResourceCounter
                label="Additional stages"
                value={numberOfStages}
                onIncrement={onIncrementStages}
                onDecrement={onDecrementStages}
                helpText={numberOfStages > 0 ? `Adds ${numberOfStages} new stage${numberOfStages > 1 ? 's' : ''} to your subscription` : undefined}
              />
            </div>

            <Button
              onClick={onSubscribe}
              disabled={loading || (streamingDays === 0 && numberOfStages === 0)}
              variant="primary"
              className="w-full mt-6"
            >
              {loading ? 'Processing...' : 'Add Resources'}
            </Button>

            {streamingDays === 0 && numberOfStages === 0 && (
              <p className="text-sm text-amber-600 mt-2 text-center">
                Please select days or stages to add
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 