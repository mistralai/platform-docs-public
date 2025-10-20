import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const keyboardKeyVariants = cva(
  'inline-flex items-center justify-center font-mono font-medium rounded text-foreground select-none',
  {
    variants: {
      size: {
        sm: 'h-6 min-w-6 px-1.5 text-xs',
        default: 'h-7 min-w-7 px-2 text-sm',
        lg: 'h-8 min-w-8 px-2.5 text-sm',
        xl: 'h-9 min-w-9 px-3 text-base',
      },
      variant: {
        default:
          'bg-background shadow-[inset_-1px_-1px_1px_0_rgba(0,0,0,0.25),0_0_0_0.5px_rgba(0,0,0,0.5)] dark:shadow-[inset_-1px_-1px_1px_0_rgba(255,255,255,0.3),0_0_0_0.5px_rgba(255,255,255,0.4)]',
        pressed:
          'bg-gray-100 dark:bg-gray-700 shadow-[inset_1px_1px_2px_0_rgba(0,0,0,0.3),0_0_0_0.5px_rgba(0,0,0,0.5)] dark:shadow-[inset_1px_1px_2px_0_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.4)]',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface KeyboardKeyProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof keyboardKeyVariants> {}

const KeyboardKey = React.forwardRef<HTMLSpanElement, KeyboardKeyProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <span
        className={cn(keyboardKeyVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
KeyboardKey.displayName = 'KeyboardKey';

export { KeyboardKey, keyboardKeyVariants };
