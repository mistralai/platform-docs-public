import { cn } from '@/lib/utils';
import React from 'react';
import BackGradient from './back-gradient';

interface PageContentProps extends React.ComponentProps<'div'> {
  as?: 'div' | 'main';
  isRoot?: boolean;
}

export default function PageContent({
  children,
  className,
  isRoot = false,
  as = 'div',
  ...props
}: PageContentProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        'relative overflow-clip bg-background rounded-lg border border-border/50 flex flex-col items-center flex-1 min-w-0',
        isRoot ? 'lg:contents border-b-0' : 'max-lg:contents',
        className
      )}
      {...props}
    >
      {children}
      <BackGradient />
    </Comp>
  );
}
