import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { PolymorphicComponentProps, PolymorphicRef } from '@/lib/utils';
import { cn } from '@/lib/utils';

const featureCardVariants = cva(
  'text-start group flex rounded-md border border-border text-card-foreground overflow-hidden transition-colors hover:bg-foreground/5',
  {
    variants: {
      variant: {
        outline: 'border bg-transparent',
        ghost: 'border-0 bg-transparent',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
      interactive: true,
    },
  }
);

type FeatureCardProps = VariantProps<typeof featureCardVariants> & {
  title: string;
  description?: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  showContent?: boolean;
};

function FeatureCard<C extends React.ElementType = 'div'>({
  title,
  description,
  icon,
  children,
  showContent = false,
  variant = 'ghost',
  size = 'default',
  interactive = false,
  className,
  as,
  ...props
}: PolymorphicComponentProps<C, FeatureCardProps>) {
  const Icon = icon;
  const Comp = as || 'div';

  return (
    <Comp
      className={cn(
        featureCardVariants({ variant, size, interactive }),
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center [&>svg]:size-8 size-18 bg-secondary border-r border-border'
          )}
        >
          <Icon className="size-8" />
        </div>
      )}
      <div className="flex-1 min-w-0 px-4 py-2 flex flex-col justify-center">
        <h3 className={cn('font-bold text-lg whitespace-nowrap truncate')}>
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'text-muted-foreground/70 font-normal text-sm line-clamp-1'
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Comp>
  );
}

export { FeatureCard, featureCardVariants };
