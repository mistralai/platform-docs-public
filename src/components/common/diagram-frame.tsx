// Frame for a diagram and the sentences that explain it (DOC-610).
//
//   import { DiagramFrame } from '@/components/common/diagram-frame';
//
//   <DiagramFrame>
//   One sentence on how to read the diagram.
//
//   <LinkedDiagram ... />
//   </DiagramFrame>
//
// Same panel style as ExplorerTabs content (border-foreground/10, rounded-lg,
// p-4), without tab semantics. `label` adds a tab-like chip on the top left,
// styled like an active ExplorerTabs trigger (classes copied from
// tabsTriggerVariants tertiary/sm: ui/tabs is a client module, so its cva
// can't be called from this server component).

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DiagramFrameProps {
  label?: string;
  className?: string;
  children: React.ReactNode;
}

export function DiagramFrame({ label, className, children }: DiagramFrameProps) {
  return (
    <figure className={cn('mt-6 mb-6 flex flex-col gap-0', className)}>
      {label && (
        <figcaption className="not-prose flex h-9 items-end">
          <span className="inline-flex items-center rounded-t-md border border-b-0 border-foreground/10 px-2.5 py-1 font-mono text-sm font-semibold uppercase text-foreground">
            {label}
          </span>
        </figcaption>
      )}
      <div
        className={cn(
          'prose max-w-none rounded-lg border border-foreground/10 bg-background p-4',
          label && 'rounded-tl-none'
        )}
      >
        {children}
      </div>
    </figure>
  );
}
