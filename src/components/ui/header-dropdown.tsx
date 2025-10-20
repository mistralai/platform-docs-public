'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MistralLogo from '@/components/brand/logo';
import { HeaderItem } from './header-logo-menu';

interface HeaderDropdownProps {
  items: HeaderItem[];
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  className?: string;
}

export const HeaderDropdown = ({
  items,
  triggerLabel = 'Docs & API',
  triggerIcon,
  className,
}: HeaderDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors',
            className
          )}
        >
          {triggerIcon && (
            <div className="p-1 rounded-sm bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
              {triggerIcon}
            </div>
          )}
          <span>{triggerLabel}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="start">
        {items.map(item => (
          <DropdownMenuItem key={item.id} asChild className="p-0">
            <Link
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors w-full"
              {...(item.isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              <div
                className={cn(
                  'p-2 rounded-md flex items-center justify-center',
                  item.bg || 'bg-gray-100 dark:bg-gray-900/20'
                )}
              >
                {item.icon || <MistralLogo className="h-4 w-4" />}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

