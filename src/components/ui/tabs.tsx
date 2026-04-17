'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TabsContext = React.createContext<{
  activeValue?: string;
  layoutId?: string;
}>({});

export const tabsListVariants = cva(
  'w-full group/tabs flex gap-1 justify-start items-end overflow-x-auto not-has-touch-screen:scrollbar-none',
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
  'relative inline-flex items-center justify-center gap-2 rounded-t-md font-semibold font-mono uppercase transition-colors border border-b-0 bg-transparent overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-primary-soft text-primary-soft data-[state=active]:text-primary-soft-foreground hover:bg-primary-soft/10 data-[state=active]:hover:bg-transparent',
        secondary:
          'border-secondary text-foreground/50 data-[state=active]:text-foreground/70 hover:bg-secondary/10 data-[state=active]:hover:bg-transparent',
        code: 'border-none text-foreground/50 bg-foreground/20 data-[state=inactive]:hover:bg-foreground/30 rounded-t cursor-default',
        tertiary:
          'border border-b-0 border-foreground/10 text-foreground/70 hover:bg-foreground/10 data-[state=active]:text-foreground cursor-pointer data-[state=active]:hover:bg-transparent',
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
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
  const layoutId = React.useId();

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider value={{ activeValue: activeTab || defaultValue, layoutId }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn('flex flex-col gap-2', className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          setActiveTab(v);
          onValueChange?.(v);
        }}
        {...props}
      />
    </TabsContext.Provider>
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

function TabsTrigger({ className, variant, size, value, children, ...props }: TabsTriggerProps) {
  const { activeValue, layoutId } = React.useContext(TabsContext);
  const isActive = activeValue === value;
  
  let indicatorBgClass = '';
  switch (variant) {
    case 'secondary': indicatorBgClass = 'bg-secondary'; break;
    case 'tertiary': indicatorBgClass = 'bg-foreground/5'; break;
    case 'code': indicatorBgClass = 'bg-foreground/20'; break;
    case 'default':
    default: indicatorBgClass = 'bg-primary-soft'; break;
  }

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    >
      {isActive && variant !== 'code' && (
        <motion.div
          layoutId={`${layoutId}-indicator`}
          className={cn("absolute inset-0 z-0", indicatorBgClass)}
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 w-full h-full flex items-center justify-center gap-2">
        {children}
      </span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none relative', className)}
      {...props}
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-full block"
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
