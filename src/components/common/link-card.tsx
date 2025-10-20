import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PixelGrid } from './pixel-grid';

interface LinkCardProps extends React.ComponentProps<'a'> {
  title: string;
  icon?: React.ReactNode;
  href: string;
  hoverColor?: string;
  pixelEffect?: boolean;
}

function LinkCard({
  title,
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
        'relative overflow-clip text-foreground rounded-lg border border-border flex items-center justify-center gap-4 h-16 2xl:h-20 p-6 bg-foreground/10 transition-colors duration-100 hover:bg-[var(--hover-color)] group',
        className
      )}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {pixelEffect && <PixelGrid pixelSize={8} opacity={0.35} />}

      <div className="flex items-center gap-2.5 z-10">
        <span className="text-foreground/50">{icon}</span>
        <h3
          className={cn(
            'font-bold text-base 2xl:text-lg dark:group-hover:text-black/70 transition-colors duration-100'
          )}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}

function UsefullLinkContainer({ children }: { children: React.ReactNode }) {
  // modify the props that are passed to the children
  const modifiedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        hoverColor: COLOR_INDEX[index % COLOR_INDEX.length],
      } as LinkCardProps);
    }
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {modifiedChildren}
    </div>
  );
}

export { LinkCard, UsefullLinkContainer };

const COLOR_INDEX = ['#F097D7', '#FF9549', '#D0D94C', '#B7E2ED'];
