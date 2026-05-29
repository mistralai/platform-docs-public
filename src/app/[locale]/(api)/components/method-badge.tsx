import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const MethodBadge = ({
  active = false,
  children,
  size = 'xs',
}: {
  active?: boolean;
  children: React.ReactNode;
} & BadgeProps) => {
  return (
    <Badge
      variant="default"
      size={size}
      className={cn(
        'uppercase font-mono',
        active ? 'bg-primary' : 'bg-primary-soft/20 text-primary-soft'
      )}
    >
      {children}
    </Badge>
  );
};
