'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { CopyBadge } from './copy-badge';
import { cn } from '@/lib/utils';

export function ApiNamesBadges({
  names,
  maxVisible = 2,
}: {
  names: string[];
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const visible = expanded ? names : names.slice(0, maxVisible);
  const hiddenCount = Math.max(names.length - maxVisible, 0);
  if (names.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 md:justify-end items-end">
      {visible.map((name, index) => (
        <CopyBadge
          key={name}
          variant="outline"
          className={cn('font-mono')}
          copyText={name}
        >
          {name}
        </CopyBadge>
      ))}
      {names.length > maxVisible && (
        <Badge
          variant={expanded ? 'secondary' : 'outline'}
          className="text-foreground/50 font-mono cursor-pointer w-8"
          asChild
          style={{
            order: expanded ? '0' : undefined,
          }}
        >
          <button onClick={() => setExpanded(v => !v)}>
            {expanded ? 'X' : `+${hiddenCount}`}
          </button>
        </Badge>
      )}
    </div>
  );
}
