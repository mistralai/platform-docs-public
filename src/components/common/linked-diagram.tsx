// Hand-coded SVG diagram with clickable areas (DOC-610).
//
//   import { LinkedDiagram } from '@/components/common/linked-diagram';
//
//   <LinkedDiagram
//     src="/img/audio_offline_or_realtime.svg"
//     alt="What the diagram shows"
//     viewBox={[940, 640]}
//     links={[{ href: '/studio/audio/...', label: 'Offline', x: 540, y: 75, width: 380, height: 90 }]}
//   />
//
// The SVG stays an <img> (theme-aware through its own media query, scaled
// responsively); each link is an absolutely positioned anchor over the image,
// placed in viewBox units and converted to percentages, so it follows the
// image at every width. Copy x/y/width/height (and rx, default 14) from the
// shape in the SVG.

import * as React from 'react';
import { Link } from '@/i18n/navigation.client';
import { cn } from '@/lib/utils';

interface DiagramLink {
  href: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
}

interface LinkedDiagramProps {
  src: string;
  alt: string;
  viewBox: [number, number];
  links: DiagramLink[];
  className?: string;
}

export function LinkedDiagram({
  src,
  alt,
  viewBox: [vbWidth, vbHeight],
  links,
  className,
}: LinkedDiagramProps) {
  return (
    <div className={cn('my-4 flex justify-center', className)}>
      <div className="relative w-fit max-w-full">
        <img src={src} alt={alt} className="!m-0 block h-auto max-w-full" />
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.x}-${link.y}`}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            className="absolute outline-none transition-shadow hover:ring-2 hover:ring-[#d35a20] focus-visible:ring-2 focus-visible:ring-[#d35a20]"
            style={{
              left: `${(link.x / vbWidth) * 100}%`,
              top: `${(link.y / vbHeight) * 100}%`,
              width: `${(link.width / vbWidth) * 100}%`,
              height: `${(link.height / vbHeight) * 100}%`,
              borderRadius: `${((link.rx ?? 14) / link.width) * 100}% / ${((link.rx ?? 14) / link.height) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
