'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Bullet } from '@/components/ui/bullet';
import MistralLogo from '@/components/brand/logo';
import { MobileMenuClose } from '../layout/mobile-menu';

export interface HeaderItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  bg?: string;
  section?: string;
}

export interface HeaderSection {
  id: string;
  label: string;
  items: HeaderItem[];
}

export interface HeaderLogoMenuProps {
  items: HeaderItem[];
  sections?: HeaderSection[];
  defaultIcon?: React.ReactNode;
  defaultBg?: string;
  className?: string;
  onItemClick?: (item: HeaderItem) => void;
}

const isActive = (href: string, pathname: string, items: HeaderItem[]) => {
  if (href === '/') {
    return !items.some(({ href }) => href !== '/' && pathname.startsWith(href));
  }
  return pathname.startsWith(href);
};

const HeaderItemComponent = ({
  item,
  isItemActive,
  defaultIcon,
  defaultBg,
  onItemClick,
  isMobile = false,
}: {
  item: HeaderItem;
  isItemActive: boolean;
  defaultIcon?: React.ReactNode;
  defaultBg?: string;
  onItemClick?: (item: HeaderItem) => void;
  isMobile?: boolean;
}) => {
  const icon = item.icon || defaultIcon || <MistralLogo className="h-4 w-4" />;
  const bgColor = item.bg || defaultBg || 'bg-gray-100';

  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const linkProps = {
    href: item.href,
    ...(item.isExternal && {
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
  };

  if (isMobile) {
    return (
      <MobileMenuClose key={item.id} asChild>
        <Link
          className={cn(
            'w-full h-10 px-3 flex items-center rounded-sm justify-between gap-2',
            { 'bg-sidebar-accent font-bold': isItemActive },
            { 'pl-0': !isItemActive }
          )}
          onClick={handleClick}
          {...linkProps}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'p-1 rounded-sm flex items-center justify-center',
                bgColor
              )}
            >
              {icon}
            </div>
            <span>{item.label}</span>
          </div>
          {isItemActive ? <Bullet variant="primary" /> : null}
        </Link>
      </MobileMenuClose>
    );
  }

  return (
    <Link
      key={item.id}
      className="inline-flex gap-2 items-center transition-opacity duration-300 hover:opacity-60"
      onClick={handleClick}
      {...linkProps}
    >
      <Bullet variant={isItemActive ? 'primary' : 'secondary'} />
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'p-1 rounded-sm flex items-center justify-center',
            bgColor
          )}
        >
          {icon}
        </div>
        <span className={cn(isItemActive ? 'font-bold' : 'text-foreground')}>
          {item.label}
        </span>
      </div>
    </Link>
  );
};

export const HeaderLogoMenu = ({
  items,
  sections,
  defaultIcon,
  defaultBg,
  className,
  onItemClick,
}: HeaderLogoMenuProps) => {
  const pathname = usePathname();

  if (sections && sections.length > 0) {
    return (
      <nav
        className={cn(
          'items-center flex gap-5 justify-center pointer-events-auto',
          className
        )}
      >
        {sections.map(section => (
          <div key={section.id} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {section.label}
            </span>
            <div className="flex gap-3">
              {section.items.map(item => (
                <HeaderItemComponent
                  key={item.id}
                  item={item}
                  isItemActive={isActive(item.href, pathname, items)}
                  defaultIcon={defaultIcon}
                  defaultBg={defaultBg}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        'items-center flex gap-5 justify-center pointer-events-auto',
        className
      )}
    >
      {items.map(item => (
        <HeaderItemComponent
          key={item.id}
          item={item}
          isItemActive={isActive(item.href, pathname, items)}
          defaultIcon={defaultIcon}
          defaultBg={defaultBg}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export const MobileHeaderLogoMenu = ({
  items,
  sections,
  defaultIcon,
  defaultBg,
  onItemClick,
}: HeaderLogoMenuProps) => {
  const pathname = usePathname();

  if (sections && sections.length > 0) {
    return (
      <nav className="flex w-full flex-col gap-4">
        {sections.map(section => (
          <div key={section.id} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-3">
              {section.label}
            </span>
            <div className="flex flex-col gap-1">
              {section.items.map(item => (
                <HeaderItemComponent
                  key={item.id}
                  item={item}
                  isItemActive={isActive(item.href, pathname, items)}
                  defaultIcon={defaultIcon}
                  defaultBg={defaultBg}
                  onItemClick={onItemClick}
                  isMobile={true}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex w-full flex-col gap-1">
      {items.map(item => (
        <HeaderItemComponent
          key={item.id}
          item={item}
          isItemActive={isActive(item.href, pathname, items)}
          defaultIcon={defaultIcon}
          defaultBg={defaultBg}
          onItemClick={onItemClick}
          isMobile={true}
        />
      ))}
    </nav>
  );
};

