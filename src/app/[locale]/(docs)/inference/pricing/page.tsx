import type { Metadata } from 'next';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { SectionTab } from '@/components/layout/section-tab';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import { PRICING_TABLES } from '@/schema';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';
import PricingTable from './_components/pricing-table';

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  image: '/ogs/docs.png',
  eyebraw: 'Inference',
  title: 'API pricing',
  description: 'Pricing for Mistral models through the API, organized by family.',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const title = l.text('API pricing', { context: 'Page title for model pricing through the API' });
  const description = l.text('Pricing for Mistral models through the API, organized by family.', { context: 'Meta description for the model pricing page' });
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://docs.mistral.ai/inference/pricing',
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_DIMENSIONS.width,
          height: OG_IMAGE_DIMENSIONS.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

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
          <HeadingTitle as="h1">{l.text('API pricing', { context: 'Page title for model pricing through the API' })}</HeadingTitle>
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
