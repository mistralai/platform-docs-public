import * as React from 'react';
import { Link } from '@/i18n/navigation.client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AppName = 'studio' | 'admin' | 'vibe';

const APP_LABEL: Record<AppName, string> = {
  studio: 'Studio',
  admin: 'Admin Console',
  vibe: 'Vibe',
};

interface AppLinkProps {
  href: string;
  app?: AppName;
  children?: React.ReactNode;
  path?: React.ReactNode[];
  className?: string;
}

/**
 * Inline navigation pill for links that point to a specific location
 * inside a Mistral product (Vibe, Studio, Admin).
 *
 * Renders as:  [ Admin Console ›  Organization  ›  Billing ↗ ]
 *
 * Usage:
 *   <AppLink href="https://admin.mistral.ai/organization/billing" app="admin" path={["Organization", "Billing"]} />
 *   <AppLink href="https://admin.mistral.ai/organization/billing" app="admin">
 *     Organization › Billing
 *   </AppLink>
 */
export function AppLink({ href, app, children, path, className }: AppLinkProps) {
  const isExternal = href.startsWith('http');
  const appLabel = app ? APP_LABEL[app] : null;
  const segments = path ?? (children ? [children] : []);
  const hasSegments = segments.length > 0;

  const content = (
    <>
      {appLabel && (
        <>
          {appLabel}
          {hasSegments && <span className="mx-0.5 text-foreground/30">›</span>}
        </>
      )}
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-0.5 text-foreground/30">›</span>}
          {segment}
        </React.Fragment>
      ))}
      {isExternal && <> ↗</>}
    </>
  );

  return (
    <Button size="xs" variant="outline" className={cn("not-prose text-decoration-none relative -top-px mx-0.5 align-baseline", className)} asChild>
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
