'use client';

import Link from 'next/link';
import React from 'react';
import { Bullet } from '@/components/ui/bullet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { headerLinks } from '@/schema/content/header';
import { MobileMenuClose } from '../mobile-menu';

const isActive = (href: string, pathname: string) => {
  if (href === '/') {
    return !headerLinks.some(
      ({ href }) => href !== '/' && pathname.startsWith(href)
    );
  }
  return pathname.startsWith(href);
};

export default function DesktopHeaderLinks({
  className,
}: {
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'items-center flex gap-5 justify-center pointer-events-auto',
        className
      )}
    >
      {headerLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex gap-2 items-center transition-opacity duration-300 hover:opacity-60"
        >
          <Bullet
            variant={isActive(link.href, pathname) ? 'primary' : 'secondary'}
          />
          <span
            className={cn(
              isActive(link.href, pathname) ? 'font-bold' : 'text-foreground'
            )}
          >
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export const MobileHeaderLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-col gap-1">
      {headerLinks.map(link => (
        <MobileMenuClose key={link.href} asChild>
          <Link
            className={cn(
              'w-full h-10 px-3 flex items-center rounded-sm justify-between',
              { 'bg-sidebar-accent font-bold': isActive(link.href, pathname) },
              { 'pl-0': !isActive(link.href, pathname) }
            )}
            key={link.href}
            href={link.href}
          >
            <span>{link.label}</span>
            {isActive(link.href, pathname) ? (
              <Bullet variant="primary" />
            ) : null}
          </Link>
        </MobileMenuClose>
      ))}
    </nav>
  );
};
