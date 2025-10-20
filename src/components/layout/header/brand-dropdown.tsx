'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { headerDropdownData } from '@/schema/content/header';
import { HeaderItem } from '@/components/ui/header-logo-menu';
import { match } from 'ts-pattern';
import MistralLogoSolid from '@/components/icons/assets/mistral-logo-solid';
import { BrandContextMenu } from './brand';
import { useIsTablet } from '@/hooks/use-mobile';

export const BrandProductDropdown = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const isTablet = useIsTablet();
  const dropdownItems: HeaderItem[] = headerDropdownData.map(item => ({
    ...item,
    icon: match(item.id)
      .with('admin', () => (
        <SettingsIcon className="size-4 lg:size-5 text-black dark:text-foreground" />
      ))
      .with('docs-api', () => (
        <MistralLogoSolid className="size-4 lg:size-5 text-black dark:text-foreground" />
      ))
      .otherwise(() => (
        <MistralLogoSolid className="size-4 lg:size-5 text-white" />
      )),
  }));

  // Group items by section
  const defaultItems = dropdownItems.filter(item => item.section === 'default');
  const adminItems = dropdownItems.filter(item => item.section === 'admin');

  const triggerSideOffset = isTablet ? 0 : 16;

  return (
    <>
      <span className="group-focus-visible:opacity-90 transition-opacity cursor-pointer pointer-events-auto">
        <Link href="/" onClick={e => e.stopPropagation()}>
          <BrandContextMenu>{children}</BrandContextMenu>
        </Link>
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-3 justify-start h-10 max-w-max pointer-events-auto hover:opacity-80 transition-opacity rounded-md px-1 -mx-1 outline-none ring-0">
            <span className="flex items-center gap-1 group-focus-visible:translate-x-0.5 transition-transform group-focus-visible:ring-2 group-focus-visible:ring-muted-foreground/10 rounded-lg ring-offset-2">
              <span className="font-bold text-foreground transition-colors text-sm lg:text-base whitespace-nowrap group-focus-visible:">
                {dropdownItems.find(item => item.id === 'docs-api')?.label}
              </span>
              <ChevronDown className="size-4 text-foreground group-focus-visible:text-primary transition-colors" />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-48 lg:w-[calc(var(--sidebar-width)-var(--sides)-0.5rem)] p-1 lg:p-2 rounded-xl"
          align="start"
          side="bottom"
          sideOffset={triggerSideOffset}
          alignOffset={-36}
        >
          {defaultItems.map(item => (
            <DropdownItemComponent key={item.id} item={item} />
          ))}
          {adminItems.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {adminItems.map(item => (
                <DropdownItemComponent key={item.id} item={item} />
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const DropdownItemComponent = ({ item }: { item: HeaderItem }) => (
  <DropdownMenuItem key={item.id} asChild className="p-0">
    <Link
      href={item.href}
      className="flex items-center gap-3 py-1.5 lg:py-2 px-1.5 lg:px-2 rounded-lg hover:bg-accent transition-colors w-full"
      {...(item.isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
    >
      <div
        className={cn(
          'p-1.5 lg:p-2 rounded-md flex items-center justify-center size-8 lg:size-9',
          item.bg || 'bg-foreground/10'
        )}
      >
        {item.icon}
      </div>
      <span className="font-bold">{item.label}</span>
    </Link>
  </DropdownMenuItem>
);
