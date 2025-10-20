'use client';

import { KeyboardKey } from '@/components/ui/keyboard-key';
import MagnifyingGlass from '@/components/icons/magnifying-glass';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/components/context/search-provider';

export function SearchInput() {
  const { setOpen } = useSearch();

  return (
    <Button
      data-menu-action="close"
      variant="ghost"
      onClick={() => setOpen(open => !open)}
      className="cursor-pointer flex h-8 w-full shrink items-center font-mono uppercase text-xs font-semibold text-foreground/40 hover:text-foreground/45 justify-between rounded-md bg-input pl-1.5 pr-1 transition-colors hover:bg-input/50"
    >
      <div className="flex items-center gap-2">
        <MagnifyingGlass className="h-4 w-4" />
        <span>Search docs</span>
      </div>
      <div className="flex items-center gap-1">
        <KeyboardKey size="sm">⌘K</KeyboardKey>
      </div>
    </Button>
  );
}
