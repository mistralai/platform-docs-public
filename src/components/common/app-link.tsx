import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AppName = 'lechat' | 'studio' | 'admin' | 'vibe';

const APP_LABEL: Record<AppName, string> = {
  lechat: 'Le Chat',
  studio: 'Studio',
  admin: 'Admin',
  vibe: 'Mistral Vibe',
};

interface AppLinkProps {
  href: string;
  app?: AppName;
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline navigation pill for links that point to a specific location
 * inside a Mistral product (Le Chat, Studio, Admin).
 *
 * Renders as:  [ Admin  ›  Organization  ›  Billing ↗ ]
 *
 * Usage:
 *   <AppLink href="https://admin.mistral.ai/organization/billing" app="admin">
 *     Organization › Billing
 *   </AppLink>
 */
export function AppLink({ href, app, children, className }: AppLinkProps) {
  const isExternal = href.startsWith('http');
  const appLabel = app ? APP_LABEL[app] : null;

  const content = (
    <>
      {appLabel && (
        <>
          {appLabel}
          <span className="mx-0.5 text-foreground/30">›</span>
        </>
      )}
      {children} ↗
    </>
  );

  return (
    <Button size="xs" variant="outline" className={cn("not-prose text-decoration-none mx-0.5 align-middle", className)} asChild>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href}>
          {content}
        </Link>
      )}
    </Button>
  );
}
