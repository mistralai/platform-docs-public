'use client';
import { createContext, useContext, useState } from 'react';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  Command,
} from '../ui/command';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { ArrowRightIcon, PageIcon } from '../icons/pixel';
import { useRouter, usePathname } from 'next/navigation';
import { useSearch as useSearchHook } from '@/hooks/use-search';
import { KeyboardKey } from '../ui/keyboard-key';
import { Drawer, DrawerContent } from '../ui/drawer';
import { Hit } from '@/hooks/use-search';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import clsx from 'clsx';
import useLocalStorageState from '@/hooks/use-local-storage-state';

type SearchContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchContext = createContext<SearchContextType>({
  open: false,
  setOpen: () => {},
});

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context as SearchContextType;
};

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  // Keyboard shortcut to open search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = React.useCallback(
    (href: string) => {
      setQ('');
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const [onlyDocs, setOnlyDocs] = useLocalStorageState('onlyDocs', {
    defaultValue: () => !pathname?.startsWith('/api'),
    dependencies: [pathname],
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  });

  const { ready, search } = useSearchHook();

  const hits = ready ? search(q, { type: onlyDocs ? 'docs' : undefined }) : [];

  const isMobile = useIsMobile();

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {isMobile ? (
        <Drawer
          shouldScaleBackground
          setBackgroundColorOnScale={false}
          open={open}
          onOpenChange={setOpen}
          activeSnapPoint="bottom"
          fixed
          autoFocus
        >
          <DrawerContent className="h-full">
            <Command
              shouldFilter={false}
              className="h-full rounded-b-none [&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 "
            >
              <SearchShell
                inputRef={inputRef}
                isMobile
                q={q}
                setQ={setQ}
                hits={hits}
                handleSelect={handleSelect}
              />
            </Command>
          </DrawerContent>
        </Drawer>
      ) : (
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="2xl:!max-w-3xl w-full z-[110]"
        >
          <SearchShell
            inputRef={inputRef}
            q={q}
            setQ={setQ}
            hits={hits}
            handleSelect={handleSelect}
          />
          <footer className="flex gap-6 py-4 px-6 border-t font-semibold bg-input justify-between items-center">
            <div className="flex gap-6">
              <CommandFooter text="Go to Page" cmd=" ↵ " />
              <CommandFooter text="Close" cmd=" Esc " />
            </div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Checkbox
                className="bg-background"
                checked={onlyDocs}
                onCheckedChange={checked => {
                  setOnlyDocs(checked === 'indeterminate' ? false : checked);
                  inputRef.current?.focus();
                }}
              />
              <span className="text-sm text-muted-foreground">
                Show only docs
              </span>
            </label>
          </footer>
        </CommandDialog>
      )}
      {children}
    </SearchContext.Provider>
  );
};

const SearchShell = ({
  inputRef,
  q,
  setQ,
  hits,
  handleSelect,
  isMobile = false,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  q: string;
  setQ: (q: string) => void;
  hits: any[];
  handleSelect: (href: string) => void;
  isMobile?: boolean;
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let raf: number;
    if (listRef.current) {
      raf = requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
    return () => cancelAnimationFrame(raf);
  }, [hits]);

  return (
    <>
      <CommandInput
        className="h-12"
        placeholder="Search documentation..."
        value={q}
        autoFocus={!isMobile}
        ref={inputRef}
        onValueChange={setQ}
      />
      <CommandList
        ref={listRef}
        className="min-h-[300px] h-full flex flex-col overflow-y-auto scrollbar-none scroll-py-6 scroll-m-0"
      >
        <CommandEmpty className="flex flex-col items-center justify-center gap-4 md:h-[300px] h-full">
          <div className="flex flex-col items-center gap-2 justify-center pb-12">
            <Image
              className="!size-20 relative ml-6"
              src="/assets/sprites/cat_sleeping.gif"
              alt="Cat"
              width={76}
              height={76}
            />

            <span className="text-lg text-muted-foreground font-bold">
              No results found.
            </span>
          </div>
        </CommandEmpty>
        <CommandGroup
          heading={q.length > 0 ? `${hits.length} results` : 'Recommended'}
          className={cn('p-4', hits.length === 0 && 'hidden')}
        >
          {hits.map(item =>
            item.isSuggestion ? (
              <SearchSuggestions
                item={item}
                handleSelect={handleSelect}
                isMobile={isMobile}
              />
            ) : (
              <SearchResult
                item={item}
                handleSelect={handleSelect}
                isMobile={isMobile}
                q={q}
              />
            )
          )}
        </CommandGroup>
      </CommandList>
    </>
  );
};

const CommandFooter = ({ text, cmd }: { text: string; cmd: string }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-foreground/50 font-mono">{text}</span>
      <KeyboardKey size="sm">{cmd}</KeyboardKey>
    </div>
  );
};

function HighlightedText({
  text,
  query,
  className = '',
}: {
  text: string;
  query: string;
  className?: string;
}) {
  if (!query.trim()) return <span className={className}>{text}</span>;

  // Create regex that matches the full query or individual words
  const queryWords = query
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 1);
  const regexPattern = `(${[query, ...queryWords]
    .map(
      term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape special regex chars
    )
    .join('|')})`;

  const parts = text.split(new RegExp(regexPattern, 'gi'));

  const isSomethingHighlighted = parts.some(part => {
    const lowerPart = part.toLowerCase();
    return (
      query.toLowerCase().includes(lowerPart) ||
      lowerPart.includes(query.toLowerCase()) ||
      queryWords.some(word => word.toLowerCase() === lowerPart)
    );
  });

  if (!isSomethingHighlighted) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        const shouldHighlight =
          query.toLowerCase().includes(lowerPart) ||
          lowerPart.includes(query.toLowerCase()) ||
          queryWords.some(word => word.toLowerCase() === lowerPart);

        return shouldHighlight ? (
          <span className="text-primary" key={index}>
            {part}
          </span>
        ) : (
          part
        );
      })}
    </span>
  );
}

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  return (
    <HighlightedText
      text={title}
      query={query}
      className="text-foreground/70"
    />
  );
}

function useIsMobile(query = '(max-width: 768px)') {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches);

    // set initial
    setIsMobile(mql.matches);
    // subscribe (support older Safari)
    if (mql.addEventListener) mql.addEventListener('change', onChange as any);
    else mql.addListener(onChange as any);

    return () => {
      if (mql.removeEventListener)
        mql.removeEventListener('change', onChange as any);
      else mql.removeListener(onChange as any);
    };
  }, [query]);
  return isMobile;
}

const SearchSuggestions = ({
  item,
  handleSelect,
  isMobile,
}: {
  item: Hit;
  handleSelect: (href: string) => void;
  isMobile: boolean;
}) => {
  return (
    <CommandItem
      key={item.url}
      value={item.id}
      onSelect={() => handleSelect(item.url)}
      className={cn(
        'flex flex-col items-start gap-1 relative group p-0',
        !isMobile && 'data-[selected=true]:bg-muted',
        !isMobile &&
          'data-[selected=true]:after:absolute data-[selected=true]:after:content-[""] data-[selected=true]:after:left-0 data-[selected=true]:after:top-0 data-[selected=true]:after:bg-primary data-[selected=true]:after:w-0.5 data-[selected=true]:after:h-full'
      )}
    >
      <div className="flex items-center gap-2 max-w-[400px]">
        <PageIcon className="size-5 text-primary" />
        <span className="text-foreground/70 truncate text-md ">
          {item.title}
        </span>
      </div>
      <ArrowRightIcon
        className={cn(
          'size-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground',
          !isMobile && 'group-data-[selected=true]:text-primary'
        )}
      />
    </CommandItem>
  );
};

const SearchResult = ({
  item,
  handleSelect,
  isMobile,
  q,
}: {
  item: Hit;
  handleSelect: (href: string) => void;
  isMobile: boolean;
  q: string;
}) => {
  return (
    <CommandItem
      key={item.id}
      onSelect={() => handleSelect(item.url)}
      className={cn(
        'flex flex-col items-start gap-1 relative group p-0',
        !isMobile && 'data-[selected=true]:bg-muted',
        !isMobile &&
          'data-[selected=true]:after:absolute data-[selected=true]:after:content-[""] data-[selected=true]:after:left-0 data-[selected=true]:after:top-0 data-[selected=true]:after:bg-primary data-[selected=true]:after:w-0.5 data-[selected=true]:after:h-full'
      )}
    >
      <div className="text-foreground/50 truncate font-semibold text-xs font-mono">
        {item.breadcrumbs?.map((c: any, i: number) => (
          <React.Fragment key={c.url}>
            {i > 0 && <span className="text-muted-foreground">{' > '}</span>}
            <HighlightedText
              text={c.title}
              query={q}
              className="uppercase text-foreground/50"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col max-w-full md:max-w-[400px] gap-0.5">
        <div className="font-bold text-foreground flex items-baseline gap-2">
          {item.type === 'endpoint' && item.method ? (
            <Badge
              variant="default"
              size="xs"
              className={clsx(
                Object.values(item.match).some(m => m.includes('method')) &&
                  'outline outline-primary outline-offset-1',
                'bg-primary-soft/20 text-primary-soft'
              )}
            >
              {item.method}
            </Badge>
          ) : null}
          <HighlightedTitle title={item.title} query={q} />
        </div>
        {item.snippet ? (
          <div
            className="text-sm text-muted-foreground [&>mark]:bg-transparent [&>mark]:text-primary w-full truncate"
            dangerouslySetInnerHTML={{ __html: item.snippet }}
          />
        ) : (
          <div className="text-sm text-muted-foreground h-4">
            {item.description}
          </div>
        )}
      </div>

      <ArrowRightIcon
        className={cn(
          'size-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground',
          !isMobile && 'group-data-[selected=true]:text-primary'
        )}
      />
    </CommandItem>
  );
};
