import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PixelGrid } from './pixel-grid';

interface LinkCardProps extends React.ComponentProps<'a'> {
  title: string;
  hoverTitle?: string;
  icon?: React.ReactNode;
  href: string;
  hoverColor?: string;
  pixelEffect?: boolean;
}

function LinkCard({
  title,
  hoverTitle,
  icon,
  href,
  hoverColor,
  className,
  pixelEffect = true,
  ...props
}: LinkCardProps) {
  const isExternal = href.startsWith('http');
  return (
    <Link
      href={href}
      style={
        {
          '--hover-color': hoverColor,
        } as React.CSSProperties
      }
      className={cn(
        'relative overflow-clip text-foreground no-underline rounded-lg border border-border flex items-center justify-center gap-4 h-16 2xl:h-20 p-6 bg-foreground/10 dark:bg-foreground/5 transition-colors duration-300 ease-in-out hover:bg-[var(--hover-color)] dark:hover:bg-zinc-900 group',
        className
      )}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {pixelEffect && <PixelGrid pixelSize={8} opacity={0.35} />}

      <div className="flex items-center gap-2.5 z-10">
        <span className="text-foreground dark:group-hover:text-white transition-colors duration-100">{icon}</span>
        <span
          className={cn(
            'font-semibold text-sm text-center group-hover:text-black/80 dark:group-hover:text-white transition-colors duration-100'
          )}
        >
          {hoverTitle ? (
            <>
              <span className="group-hover:hidden">{title}</span>
              <span className="hidden group-hover:inline">{hoverTitle}</span>
            </>
          ) : (
            title
          )}
        </span>
      </div>
    </Link>
  );
}

function UsefullLinkContainer({ children }: { children: React.ReactNode }) {
  // modify the props that are passed to the children
  const modifiedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        hoverColor: '#FF8205',
      } as LinkCardProps);
    }
  });
  return (
    <div className="not-prose grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
      {modifiedChildren}
    </div>
  );
}

export { LinkCard, UsefullLinkContainer };
