'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useDocsVariant } from '@/contexts/docs-variant';

const headingVariants = cva('flex', {
  variants: {
    align: {
      left: 'text-left flex-col',
      center: 'text-center items-center flex-col',
      right: 'text-right items-end flex-col',
      between: 'flex-col md:flex-row justify-between items-baseline',
    },
    spacing: {
      none: 'gap-0',
      sm: 'gap-1',
      default: 'gap-2',
      lg: 'gap-3',
      xl: 'gap-4',
    },
  },
  defaultVariants: {
    align: 'left',
    spacing: 'default',
  },
});

const headingTitleVariantsDocs = cva('font-bold shrink-0', {
  variants: {
    size: {
      h1: 'text-4xl lg:text-5xl',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-2xl lg:text-3xl',
      h4: 'text-xl lg:text-2xl',
      h5: 'text-lg lg:text-xl',
      h6: 'text-base lg:text-lg',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const headingTitleVariantsApi = cva('', {
  variants: {
    size: {
      h1: 'text-3xl lg:text-4xl font-bold',
      h2: 'text-sm',
      h3: 'text-lg font-bold',
      h4: 'text-base font-bold',
      h5: 'text-base',
      h6: 'text-sm',
    },
  },
});

const headingSubtitleVariants = cva(
  'font-normal max-w-2xl text-pretty md:text-balance',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-sm 2xl:text-base',
        lg: 'text-lg',
      },
      color: {
        default: 'text-muted-foreground',
        foreground: 'text-foreground',
        primary: 'text-primary',
        destructive: 'text-destructive',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  }
);

const headingCTAsVariants = cva('flex gap-2 mt-4', {
  variants: {
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
  },
  defaultVariants: {
    justify: 'start',
    wrap: false,
    direction: 'row',
  },
});

interface HeadingProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

export interface HeadingTitleProps
  extends Omit<React.ComponentProps<'h1'>, 'color'>,
    VariantProps<typeof headingTitleVariantsDocs> {
  asChild?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface HeadingSubtitleProps
  extends Omit<React.ComponentProps<'p'>, 'color'>,
    VariantProps<typeof headingSubtitleVariants> {
  asChild?: boolean;
  as?: 'p' | 'span' | 'div';
}

export interface HeadingCTAsProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof headingCTAsVariants> {
  asChild?: boolean;
}

export function Heading({
  className,
  align,
  spacing,
  asChild = false,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="heading"
      className={cn(headingVariants({ align, spacing }), className)}
      {...props}
    />
  );
}

export function HeadingTitle({
  className,
  size,
  color,
  asChild = false,
  as = 'h1',
  ...props
}: HeadingTitleProps) {
  const Comp = asChild ? Slot : as;
  const effectiveSize = size || as;
  const [_, dvc] = useDocsVariant();

  return (
    <Comp
      data-slot="heading-title"
      data-type="heading"
      className={cn(
        dvc({
          docs: headingTitleVariantsDocs({ size: effectiveSize, color }),
          api: headingTitleVariantsApi({ size: effectiveSize }),
        }),
        className
      )}
      {...props}
    />
  );
}

export function HeadingSubtitle({
  className,
  size,
  color,
  asChild = false,
  as = 'p',
  ...props
}: HeadingSubtitleProps) {
  const Comp = asChild ? Slot : as;

  return (
    <Comp
      data-slot="heading-subtitle"
      className={cn(headingSubtitleVariants({ size, color }), className)}
      {...props}
    />
  );
}

export function HeadingCTAs({
  className,
  justify,
  wrap,
  direction,
  asChild = false,
  ...props
}: HeadingCTAsProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="heading-ctas"
      className={cn(
        headingCTAsVariants({ justify, wrap, direction }),
        className
      )}
      {...props}
    />
  );
}
