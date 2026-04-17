'use client';

import Link from 'next/link';
import React from 'react';
import { Bullet } from '@/components/ui/bullet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { headerLinks, getActiveHeaderTab } from '@/schema/content/header';
import { MobileMenuClose } from '../mobile-menu';

export default function DesktopHeaderLinks({
  className,
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const activeTab = getActiveHeaderTab(pathname);

  return (
    <nav className={cn('flex items-center gap-1 pointer-events-auto flex-nowrap', className)}>
      {headerLinks.map(link => {
        const isActive = activeTab.label === link.label;

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              'inline-flex gap-2 items-center px-2.5 py-1.5 text-sm rounded-md transition-colors duration-150 whitespace-nowrap',
              isActive
                ? 'font-bold text-foreground'
                : 'font-medium text-foreground/70 hover:text-foreground'
            )}
          >
            <Bullet
              variant={isActive ? 'primary' : 'secondary'}
              size="default"
              className="transition-colors"
            />
            <span className="inline-flex flex-col items-start after:content-[attr(data-label)] after:font-bold after:h-0 after:invisible after:overflow-hidden" data-label={link.label}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export const MobileHeaderLinks = () => {
  const pathname = usePathname();
  const activeTab = getActiveHeaderTab(pathname);

  return (
    <nav className="flex w-full flex-col gap-1">
      {headerLinks.map(link => {
        const isActive = activeTab.label === link.label;
        const linkClassName = cn(
          'w-full h-10 px-3 flex items-center rounded-sm justify-between',
          { 'bg-sidebar-accent font-bold': isActive },
          { 'pl-0': !isActive }
        );

        return (
          <MobileMenuClose key={link.label} asChild>
            <Link className={linkClassName} href={link.href}>
              <span className="flex items-center">{link.label}</span>
              {isActive ? <Bullet variant="primary" /> : null}
            </Link>
          </MobileMenuClose>
        );
      })}
    </nav>
  );
};
