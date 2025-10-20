import * as React from 'react';
import { cn } from '@/lib/utils';
import ScrollGradient from './scroll-gradient';

export const table = ({ children, className, ...props }: any) => (
  <ScrollGradient
    data-type="table"
    direction="x"
    gradientSize={56}
    className="[&_table]:mt-0 [&_table]:mb-0 [&_table]:w-full"
  >
    <table className={className} {...props}>
      {children}
    </table>
  </ScrollGradient>
);

export const thead = ({ children, className, ...props }: any) => (
  <thead
    className={cn('[&_tr]:border-b [&_tr]:border-solid', className)}
    {...props}
  >
    {children}
  </thead>
);

export const tbody = ({ children, className, ...props }: any) => (
  <tbody
    className={cn(
      '[&_tr]:border-dashed [&_tr]:hover:bg-muted/50 [&_tr:last-child]:border-0',
      className
    )}
    {...props}
  >
    {children}
  </tbody>
);

export const tr = ({ children, className, ...props }: any) => (
  <tr
    className={cn(
      'border-b transition-colors border-foreground/30 data-[state=selected]:bg-muted text-sm',
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

export const th = ({ children, className, ...props }: any) => (
  <th
    className={cn(
      'px-4 py-4 text-left align-middle whitespace-nowrap font-bold text-muted-foreground [&:has([role=checkbox])]:pr-0 [&_tr]:border-dashed',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const td = ({ children, className, ...props }: any) => (
  <td
    className={cn(
      'px-4 py-4 align-middle dark:text-foreground/50 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export const markdownTableComponents = { table, thead, tbody, tr, th, td };
