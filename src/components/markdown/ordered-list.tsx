'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bullet } from '@/components/ui/bullet';

const OrderedListContext = React.createContext(false);

export const OrderedList = ({
  children,
  className,
  ref: _r,
  ...props
}: React.DetailedHTMLProps<
  React.OlHTMLAttributes<HTMLOListElement>,
  HTMLOListElement
>) => {
  return (
    <OrderedListContext.Provider value={true}>
      <ol
        className={cn(
          'list-none text-secondary-foreground ordered-list',
          className
        )}
        {...props}
      >
        {children}
      </ol>
    </OrderedListContext.Provider>
  );
};

export const UnorderedList = ({
  children,
  className,
  ref: _r,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>) => {
  return (
    <OrderedListContext.Provider value={false}>
      <ul
        className={cn('list-none text-secondary-foreground', className)}
        {...props}
      >
        {children}
      </ul>
    </OrderedListContext.Provider>
  );
};

export const ListItem = ({
  children,
  className,
  ref: _r,
  ...props
}: React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>) => {
  const ordered = React.useContext(OrderedListContext);
  if (ordered) {
    return (
      <li
        className={cn(
          'list-none text-secondary-foreground ordered-list-item',
          className
        )}
        {...props}
      >
        {children}
      </li>
    );
  }
  return (
    <li
      className={cn(
        'relative list-none text-secondary-foreground',
        className
      )}
      {...props}
    >
      <Bullet
        className="absolute -left-2 top-[0.75em] -translate-y-1/2"
        size="sm"
        data-bullet
      />
      {children}
    </li>
  );
};
