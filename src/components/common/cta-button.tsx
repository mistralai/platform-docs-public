import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export function CtaButton({
  href,
  children,
  variant = 'outline',
  className,
}: CtaButtonProps) {
  const isExternal = href.startsWith('http');

  return (
    <Button size="sm" variant={variant} className={cn("not-prose my-2 text-decoration-none", className)} asChild>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children} ↗
        </a>
      ) : (
        <Link href={href}>{children}</Link>
      )}
    </Button>
  );
}
