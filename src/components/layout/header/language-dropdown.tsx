'use client';

import { usePathname as useRawPathname } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { useLingo } from '@lingo.dev/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/i18n/navigation.client';
import { locales, type Locale } from '@/i18n/config';
import { prefixWithLocale, stripLocale } from '@/i18n/utils';
import { cn } from '@/lib/utils';

const LANGUAGE_META: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
};

export function LanguageDropdown({
  contentClassName,
}: {
  contentClassName?: string;
}) {
  const l = useLingo();
  const currentLocale = useLocale() as Locale;
  const pathWithoutLocale = stripLocale(useRawPathname());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={l.text('Change language', {
            context: 'Accessible label for switching language',
          })}
          className="pointer-events-auto"
          // className="border border-border bg-border/50 pointer-events-auto hover:!bg-border/50 text-foreground"
        >
          <Globe className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn('min-w-44', contentClassName)}
      >
        {locales.map(code => {
          const meta = LANGUAGE_META[code];
          const isActive = code === currentLocale;
          const localizedPath = prefixWithLocale(pathWithoutLocale, code);

          return (
            <DropdownMenuItem
              key={code}
              asChild={!isActive}
              disabled={isActive}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'gap-2',
                isActive &&
                  'font-semibold text-foreground data-[disabled]:opacity-100 data-[disabled]:pointer-events-none'
              )}
            >
              {isActive ? (
                <div className="flex w-full items-center gap-2">
                  <span aria-hidden className="text-base leading-none">
                    {meta.flag}
                  </span>
                  <span>{meta.label}</span>
                  <Check className="ml-auto size-4 text-foreground/60" />
                </div>
              ) : (
                <a href={localizedPath} className="flex w-full items-center gap-2">
                  <span aria-hidden className="text-base leading-none">
                    {meta.flag}
                  </span>
                  <span>{meta.label}</span>
                </a>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
