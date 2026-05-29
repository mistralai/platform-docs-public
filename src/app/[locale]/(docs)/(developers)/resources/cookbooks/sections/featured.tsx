import { SectionTab } from '@/components/layout/section-tab';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { CookbookCard } from '@/components/model/cookbook-card';
import { curatedFeaturedCookbooks } from '@/schema/cookbook/data-formatted';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

export default async function CookbookFeaturedSection({ locale }: { locale: Locale }) {
  if (curatedFeaturedCookbooks.length === 0) {
    return null;
  }
  const l = await getLingo(locale);

  return (
    <section id="featured" className="flex flex-col gap-6">
      <SectionTab sectionId='featured-cookbooks'>{l.text('Featured Cookbooks', { context: 'Heading for featured developer cookbooks' })}</SectionTab>

      <Heading align="between">
        <HeadingTitle size="h3" as="h2">
          {l.text('Featured Cookbooks', { context: 'Subheading for featured developer cookbooks' })}
        </HeadingTitle>
        <HeadingSubtitle>
          {l.text('Discover our best cookbooks', { context: 'Description of featured developer cookbooks' })}
        </HeadingSubtitle>
      </Heading>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {curatedFeaturedCookbooks.slice(0, 11).map((cookbook, index) => {
          // First card: col-span-2 + primary variant
          if (index === 0) {
            return (
              <CookbookCard
                key={cookbook.slug}
                cookbook={cookbook}
                variant="primary"
                size="large"
                pixelEffect={true}
                showTags={true}
                className="col-span-2"
              />
            );
          }

          // Second card: secondary variant
          if (index === 1) {
            return (
              <CookbookCard
                key={cookbook.slug}
                cookbook={cookbook}
                variant="secondary"
                size="default"
                pixelEffect={true}
                showTags={true}
              />
            );
          }

          // Remaining cards: tertiary variant
          return (
            <CookbookCard
              key={cookbook.slug}
              cookbook={cookbook}
              variant="tertiary"
              size="default"
              pixelEffect={true}
              showTags={true}
            />
          );
        })}
      </div>
    </section>
  );
}
