'use client';

import { Button } from '@/components/ui/button';
import CollabLogo from '../icons/collab';
import { useLingo } from '@lingo.dev/react';

export function CollabButton({ colabUrl }: { colabUrl: string }) {
  const l = useLingo();
  return (
    <Button
      size={'sm'}
      variant="outline"
      className="uppercase self-start not-prose"
      asChild
    >
      <a href={colabUrl} target="_blank" rel="noopener noreferrer">
        <CollabLogo className="size-4 text-primary" />
        <span className="max-md:hidden">{l.text('Open in', { context: 'Prefix for a link to Google Colab' })}</span> Colab ↗
      </a>
    </Button>
  );
}
