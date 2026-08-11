import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { SectionTab } from '@/components/layout/section-tab';
import { PRICING_TABLES } from '@/schema';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';
import PricingTable from './_components/pricing-table';

export const metadata = {
  title: 'Pricing',
  description: 'Discover our pricing plans',
};

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);

  return (
    <div className="mx-auto space-y-14 w-full md:pt-8 not-prose">
      <div className="space-y-4">
        <Heading align="center">
          <HeadingTitle as="h1">{l.text('Pricing', { context: 'Page title for model pricing' })}</HeadingTitle>
          <HeadingSubtitle>
            {l.text('Pricing for Mistral models, organized by family.', { context: 'Introductory description for model pricing page' })}
          </HeadingSubtitle>
        </Heading>
      </div>

      {PRICING_TABLES.map(group => (
        <section key={group.id} id={group.id} className="flex flex-col gap-6">
          <SectionTab sectionId={group.id}>{group.title(l)}</SectionTab>
          {group.description && (
            <HeadingSubtitle>{group.description(l)}</HeadingSubtitle>
          )}
          <PricingTable slugs={group.slugs} />
        </section>
      ))}
    </div>
  );
}
