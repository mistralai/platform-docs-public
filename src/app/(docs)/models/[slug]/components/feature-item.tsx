import * as React from 'react';
import { cn, PolymorphicComponentProps } from '@/lib/utils';
import styles from './LinkItem.module.css';

interface FeatureItemProps extends React.ComponentProps<'div'> {
  title: string;
  description?: string;
  disabled?: boolean;
  icon: React.ElementType;
  /** Additional metadata (e.g., API path for endpoints) */
  metadata?: string;
  /** Whether this feature is supported/available */
}

export function FeatureItem<C extends React.ElementType = 'div'>({
  title,
  description,
  icon,
  metadata,
  className,
  disabled,
  as,
  ...props
}: PolymorphicComponentProps<C, FeatureItemProps>) {
  const Icon = icon;
  const Comp = as || 'div';
  return (
    <Comp
      className={cn(
        'flex gap-2 items-center',
        disabled && 'opacity-30 cursor-not-allowed',
        styles.link,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'size-10 border rounded shrink-0 bg-secondary flex items-center justify-center'
        )}
      >
        <Icon className={cn('size-6', styles.icon)} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={cn('font-semibold leading-[1.1]', styles.title)}>
          {title}
        </span>
        {description && (
          <p className="text-xs 2xl:text-sm font-mono leading-[1] text-foreground/50">
            {description}
          </p>
        )}
      </div>
    </Comp>
  );
}

export const FeatureItemWithList = <C extends React.ElementType = 'div'>({
  title,
  description,
  icon,
  metadata,
  className,
  disabled,
  children,

  as,
  ...props
}: FeatureItemProps & { href: string } & PolymorphicComponentProps<
    C,
    React.ComponentProps<'div'>
  >) => {
  const Icon = icon;
  const Comp = as || 'div';
  return (
    <div className="flex flex-col" aria-disabled={disabled}>
      <Comp
        className={cn(
          'flex gap-2 items-start',
          disabled ? 'opacity-30 cursor-not-allowed' : '',
          styles.link,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'size-10 border rounded shrink-0 bg-secondary flex items-center justify-center'
          )}
        >
          <Icon className={cn('size-6', styles.icon)} />
        </div>
        <div className="flex flex-col gap-0.5 pt-2">
          <span className={cn('font-semibold leading-[1.1]', styles.title)}>
            {title}
          </span>
          <div className={cn(styles.children, 'flex flex-col gap-0.5')}>
            {children}
          </div>
        </div>
      </Comp>
    </div>
  );
};
