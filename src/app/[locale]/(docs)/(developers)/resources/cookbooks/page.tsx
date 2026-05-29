import React from 'react';
import type { Metadata } from 'next';
import CookbookHeroSection from './sections/hero';
import CookbookTopicsSection from './sections/topics';
import CookbookFeaturedSection from './sections/featured';
import CookbookAllSection from './sections/all';

import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import { ShowAllCookbooksInlineScript } from './sections/show-all-cookbooks-inline-script';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  image: '/ogs/cookbook.png',
  eyebraw: 'COOKBOOKS',
  title: 'Cookbooks',
  description:
    'Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const tabTitle = l.text('Cookbooks - Mistral AI', { context: 'Page title for the developer cookbooks index' });
  const socialTitle = l.text('Mistral AI Cookbooks', { context: 'Main heading for the developer cookbooks page' });
  const description = l.text('Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases', { context: 'Introductory description of the developer cookbooks page' });
  return {
    title: tabTitle,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: 'https://docs.mistral.ai/cookbooks',
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_DIMENSIONS.width,
          height: OG_IMAGE_DIMENSIONS.height,
          alt: 'Mistral AI Documentation',
        },
      ],
    },
    twitter: {
      images: [ogImageUrl],
    },
  };
}

export default async function CookbookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <div className="space-y-16 not-prose">
      {/* Hero Section */}
      <CookbookHeroSection locale={locale} />

      {/* Topics Section */}
      <CookbookTopicsSection />

      {/* Featured Cookbooks */}
      <CookbookFeaturedSection locale={locale} />

      {/* All Cookbooks */}

      <CookbookAllSection />
      <ShowAllCookbooksInlineScript />
    </div>
  );
}
