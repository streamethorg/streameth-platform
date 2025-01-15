'use client';

import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { Lock } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/utils';
import { useRouter } from 'next/navigation';

interface FeatureButtonProps {
  children: ReactNode;
  organizationId: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'destructive-outline';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const FeatureButton = ({
  children,
  organizationId,
  variant = 'default',
  className,
  onClick,
  disabled,
  size = 'default',
  loading,
  type = 'button',
}: FeatureButtonProps) => {
  const router = useRouter();
  const { canUseFeatures, isLoading, organizationSlug } = useSubscription(organizationId);

  const handleClick = () => {
    if (!canUseFeatures) {
      router.push(`/studio/${organizationSlug}/payments`);
      return;
    }
    onClick?.();
  };

  return (
    <Button
      variant={variant}
      className={cn(className, 'relative', !canUseFeatures && 'opacity-60')}
      onClick={handleClick}
      disabled={disabled || isLoading}
      size={size}
      type={type}
      loading={loading}
    >
      {!canUseFeatures && !loading && <Lock className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}

export default FeatureButton;
