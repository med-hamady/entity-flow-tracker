import { EntityState } from '@/types/entity';
import { stateLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface StateBadgeProps {
  state: EntityState;
  size?: 'sm' | 'md' | 'lg';
}

export function StateBadge({ state, size = 'md' }: StateBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-all',
        sizeClasses[size],
        `state-badge-${state}`
      )}
    >
      {stateLabels[state]}
    </span>
  );
}
