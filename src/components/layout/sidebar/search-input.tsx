'use client';

import { KeyboardKey } from '@/components/ui/keyboard-key';
import MagnifyingGlass from '@/components/icons/magnifying-glass';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/components/context/search-provider';
import { useLingo } from '@lingo.dev/react';

export function SearchInput() {
  const { setOpen } = useSearch();
  const l = useLingo();

  return (
    <Button
      data-menu-action="close"
      variant="ghost"
      onClick={() => setOpen(open => !open)}
      className="cursor-pointer flex h-8 w-full shrink items-center justify-between rounded-md bg-input pl-1.5 pr-1 font-mono text-xs font-semibold uppercase text-foreground/40 transition-colors hover:bg-input/50 hover:text-foreground/45"
    >
      <div className="flex min-w-0 items-center gap-2">
        <MagnifyingGlass className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {l.text('Search docs', { context: 'Placeholder in the docs search box that opens the command palette' })}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <KeyboardKey size="sm">⌘K</KeyboardKey>
      </div>
    </Button>
  );
}
