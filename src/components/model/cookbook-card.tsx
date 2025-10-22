import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { CookbookSaved } from '@/schema/cookbook';
import { Badge } from '@/components/ui/badge';
import { PixelGrid } from '@/components/common/pixel-grid';
import { formatDate } from '@/lib/date';

const cookbookCardVariants = cva(
  'relative group flex flex-col border border-border rounded-lg overflow-hidden transition-base p-4',
  {
    variants: {
      variant: {
        primary:
          'bg-model-red/5 hover:bg-model-red/30 border-model-red min-h-64 h-full',
        secondary:
          'bg-model-orange/5 hover:bg-model-orange/30 border-model-orange min-h-48 h-full',
        tertiary:
          'bg-model-yellow/5 hover:bg-model-yellow/30 border-model-yellow min-h-48 h-full',
      },
      size: {
        default: 'p-4',
        compact: 'p-3',
        large: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
);

const cookbookCardTextVariants = cva('line-clamp-2 font-bold text-balance', {
  variants: {
    variant: {
      primary: 'text-xl 2xl:text-2xl text-model-red',
      secondary: 'text-xl 2xl:text-2xl text-model-orange',
      tertiary: 'text-lg 2xl:text-xl leading-[1.1] text-foreground',
    },
  },
});

export interface CookbookCardProps
  extends React.ComponentProps<'a'>,
    VariantProps<typeof cookbookCardVariants> {
  cookbook: CookbookSaved;
  showTags?: boolean;
  pixelEffect?: boolean;
}

export function CookbookCard({
  cookbook,
  variant = 'secondary',
  size = 'default',
  showTags = true,
  pixelEffect = true,
  className,
  ...props
}: CookbookCardProps) {
  // Create tag arrays with their types
  const useCaseTags = cookbook.useCases.map(tag => ({
    label: tag,
    variant: 'yellow' as const,
  }));

  const integrationTags = cookbook.integrations.map(tag => ({
    label: tag,
    variant: 'orange' as const,
  }));

  // Robust distribution: try to get 1 from each array first, then fill remaining
  const displayTags = [];
  const allTags = [...useCaseTags, ...integrationTags];

  // First priority: get one from each category if available
  if (useCaseTags.length > 0) {
    displayTags.push(useCaseTags[0]);
  }
  if (integrationTags.length > 0 && displayTags.length < 2) {
    displayTags.push(integrationTags[0]);
  }

  // Fill remaining slots with any remaining tags
  if (displayTags.length < 2) {
    const remainingTags = [
      ...useCaseTags.slice(displayTags.includes(useCaseTags[0]) ? 1 : 0),
      ...integrationTags.slice(
        displayTags.includes(integrationTags[0]) ? 1 : 0
      ),
    ];

    const slotsToFill = 2 - displayTags.length;
    displayTags.push(...remainingTags.slice(0, slotsToFill));
  }

  const remainingCount = allTags.length - displayTags.length;

  return (
    <Link
      href={`/cookbooks/${cookbook.slug}`}
      className={cn(cookbookCardVariants({ variant, size }), className)}
      {...props}
    >
      {pixelEffect && (
        <PixelGrid
          pixelSize={12}
          opacity={0.5}
          speed={1.5}
          className="mix-blend-screen dark:mix-blend-multiply dark:opacity-50"
        />
      )}

      {/* date and author */}
      {/*(cookbook.date && cookbook.displayDate) && (
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground z-2">
          <span>{cookbook.date}</span>
          {cookbook.author && <span>• {cookbook.author.name}</span>}
        </div>
      )*/}

      {/* Header with type badge */}
      <div className="flex flex-col gap-3 mt-auto z-2">
        <h3 className={cn(cookbookCardTextVariants({ variant }))}>
          {cookbook.title}
        </h3>

        {/* Tags section */}
        {showTags && displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {displayTags.map(({ label, variant }) => (
              <Badge
                size="sm"
                key={label}
                variant={variant}
                className="md:not-group-hover:border-border md:not-group-hover:bg-background font-mono uppercase md:dark:not-group-hover:bg-background/70 md:dark:not-group-hover:text-foreground"
              >
                {label}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge
                size="sm"
                variant="outline"
                className="font-mono uppercase bg-background"
              >
                +{remainingCount}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default CookbookCard;
