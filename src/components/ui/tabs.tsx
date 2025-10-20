'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const tabsListVariants = cva(
  'w-full group/tabs flex gap-1 justify-start items-end overflow-x-auto',
  {
    variants: {
      variant: {
        default: 'border-b border-primary-soft',
        secondary: 'border-b border-secondary',
        code: 'border-none gap-1',
        tertiary: 'border-b-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-t-md font-semibold font-mono uppercase transition-colors border border-b-0 bg-transparent',
  {
    variants: {
      variant: {
        default:
          'border-primary-soft text-primary-soft data-[state=active]:bg-primary-soft data-[state=active]:text-primary-soft-foreground hover:bg-primary-soft/10',
        secondary:
          'border-secondary text-foreground/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground/70 hover:bg-secondary/10',
        code: 'border-none text-foreground/50 bg-foreground/20 data-[state=inactive]:hover:bg-foreground/30 rounded-t cursor-default',
        tertiary:
          'border border-b-0 border-foreground/10 text-foreground/70 hover:bg-foreground/10 data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground cursor-pointer',
      },
      size: {
        default: 'px-4 py-2 text-sm',
        sm: 'px-2.5 py-1 text-sm',
        code: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, size, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none relative', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
