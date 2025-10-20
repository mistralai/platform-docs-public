import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const bulletVariants = cva('inline-block', {
  variants: {
    size: {
      sm: 'size-1.5',
      default: 'size-2',
      lg: 'size-3',
      xl: 'size-4',
    },
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-foreground/20',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'primary',
  },
});

export interface BulletProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof bulletVariants> {}

const Bullet = React.forwardRef<HTMLSpanElement, BulletProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <span
        className={cn(bulletVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Bullet.displayName = 'Bullet';

export { Bullet, bulletVariants };
