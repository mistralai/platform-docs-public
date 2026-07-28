import * as React from 'react';
import { Badge } from '../ui/badge';
import { modelStatus } from '@/schema/models/i18n';
import type { Model } from '@/schema';
import type { Lingo } from '@lingo.dev/react';

const STAGE_VARIANT: Record<
  Model['status'],
  React.ComponentProps<typeof Badge>['variant']
> = {
  PublicPreview: 'yellow',
  GA: 'outline',
  Deprecated: 'deprecated',
  Retired: 'security',
};

/**
 * Renders the lifecycle stage of a model (Public Preview, GA, Deprecated,
 * Retired). Server-compatible: pass a Lingo instance from `getLingo()` or
 * `useLingo()`.
 */
export const ModelStageBadge = ({
  status,
  l,
}: {
  status: Model['status'];
  l: Lingo;
}) => (
  <Badge
    variant={STAGE_VARIANT[status]}
    size="xs"
    className="font-mono uppercase text-[11px]"
  >
    {modelStatus(status, l)}
  </Badge>
);
