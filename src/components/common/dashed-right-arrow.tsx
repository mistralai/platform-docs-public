import { cn } from '@/lib/utils';

type DashedRightArrowProps = {
  className?: string;
  arrowSize?: number;
  lineThickness?: number;
  lineClassName?: string;
  headClassName?: string;
};

export default function DashedRightArrow({
  className,
  arrowSize = 8,
  lineThickness = 1,
  lineClassName,
  headClassName,
}: DashedRightArrowProps) {
  return (
    <div className={cn('flex w-full items-center text-foreground', className)}>
      <div
        className={cn(
          'flex-1 border-t border-dashed border-current',
          lineClassName
        )}
        style={{ borderTopWidth: lineThickness }}
      />
      <div
        className={cn('shrink-0', headClassName)}
        style={{
          width: 0,
          height: 0,
          borderTop: `${arrowSize / 2}px solid transparent`,
          borderBottom: `${arrowSize / 2}px solid transparent`,
          borderLeft: `${arrowSize}px solid currentColor`,
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
}
