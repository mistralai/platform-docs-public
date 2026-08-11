'use client';

import { CookbookCard } from '@/components/model/cookbook-card';
import {
  latestCookbooks,
  curatedFeaturedCookbooks,
} from '@/schema/cookbook/data-formatted';

export function LatestCookbookCards({ count = 6 }: { count?: number }) {
  const source =
    latestCookbooks.length > 0 ? latestCookbooks : curatedFeaturedCookbooks;
  const items = source.slice(0, count);

  if (items.length === 0) return null;

  return (
    <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {items.map(cookbook => (
        <CookbookCard
          key={cookbook.slug}
          cookbook={cookbook}
          variant="tertiary"
          size="default"
          pixelEffect
          showTags
        />
      ))}
    </div>
  );
}
