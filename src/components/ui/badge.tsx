import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { MODEL_COLORS } from '@/lib/colors';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-base',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        security:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground/60 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        model: 'text-black/60 border border-black/20 font-mono font-semibold',
        api: 'text-black/60 border border-black/20 font-mono font-semibold',
        other: 'text-black/60 border border-black/20 font-mono font-semibold',
        deprecated:
          'text-black/60 border border-black/20 font-mono font-semibold',
        fixed: 'text-black/60 border border-black/20 font-mono font-semibold',
        yellow:
          'bg-model-yellow border-model-yellow text-foreground/50 dark:text-background',
        orange:
          'bg-model-orange border-model-orange text-foreground/50 dark:text-background',
        'type-integer':
          'border border-types-number-foreground bg-types-number text-types-number-foreground',
        'type-number':
          'border border-types-number-foreground bg-types-number text-types-number-foreground',
        'type-union':
          'border border-types-union-foreground bg-types-union text-types-union-foreground',
        'type-string':
          'border border-types-string-foreground bg-types-string text-types-string-foreground',
        'type-boolean':
          'border border-types-boolean-foreground bg-types-boolean text-types-boolean-foreground',
        'type-null':
          'border border-types-null-foreground bg-types-null text-types-null-foreground',
        'type-object':
          'border border-types-object-foreground bg-types-object text-types-object-foreground',
        'type-array':
          'border border-types-array-foreground bg-types-array text-types-array-foreground',
        'type-enum':
          'border border-types-enum-foreground bg-types-enum text-types-enum-foreground',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs py-0.5 px-2 h-fit',
        lg: 'text-base',
        xs: 'text-xs px-1 py-0.5 h-fit',
        '2xs': 'text-[11px] px-1 h-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span';

  const getBackgroundStyle = () => {
    if (variant === 'model') {
      return { backgroundColor: MODEL_COLORS.lime, ...style };
    }
    if (variant === 'api') {
      return { backgroundColor: MODEL_COLORS.blue, ...style };
    }
    if (variant === 'other') {
      return { backgroundColor: MODEL_COLORS.yellow, ...style };
    }
    if (variant === 'security') {
      return { backgroundColor: MODEL_COLORS.red, ...style };
    }
    return style;
  };

  return (
    <Comp
      data-slot="badge"
      data-badge-type={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      style={getBackgroundStyle()}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
