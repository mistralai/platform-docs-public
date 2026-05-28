'use client';

import { useLingo } from '@lingo.dev/react';
import { ArrowDownIcon } from '@/components/icons/pixel';

export function ExamplesHeadingMobileSection() {
  const l = useLingo();
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 w-full h-full flex flex-col items-center justify-center">
        <span className="flex-1 bg-secondary/80 w-full" />
        <span className="flex-1 bg-secondary/60 w-full" />
        <span className="flex-1 bg-secondary/30 w-full" />
        <span className="flex-1 bg-secondary/20 w-full" />
        <span className="flex-1 bg-secondary/10 w-full" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-1">
          <h4 className="text-2xl font-bold text-foreground">{l.text('Playground', { context: 'Heading for the live API request playground' })}</h4>
          <p className="text-sm text-muted-foreground">
            {l.rich('Test the endpoints <live>live</live>', {
              context: 'Description of the live API request playground',
              tags: { live: (c) => <strong className="text-foreground/50">{c}</strong> },
            })}
          </p>
        </div>
        <ArrowDownIcon className="size-12 text-foreground/50" />
      </div>
    </>
  );
}
