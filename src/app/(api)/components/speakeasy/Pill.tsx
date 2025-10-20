import type { PillProps } from '@speakeasy-api/docs-md-react';
import { MethodBadge } from '../method-badge';

export function Pill({ variant, children }: PillProps) {
  return (
    // Show a very obviously different Pill, in part to show that we can
    // override the default Pill implementation and pass it correctly to
    // ExpandableProperty
    <MethodBadge data-type="pill" size="default">
      {children}
    </MethodBadge>
  );
}
