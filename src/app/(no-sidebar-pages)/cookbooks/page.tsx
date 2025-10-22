import React from 'react';
import type { Metadata } from 'next';
import CookbookHeroSection from './sections/hero';
import CookbookTopicsSection from './sections/topics';
import CookbookFeaturedSection from './sections/featured';
import CookbookAllSection from './sections/all';
import UsefullLinksSection from '@/components/sections/usefull-links';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import NoSidebarPageLayout from '@/components/layout/no-sidebar-page-layout';
import { ShowAllCookbooksInlineScript } from './sections/show-all-cookbooks-inline-script';

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  image: '/ogs/cookbook.png',
  eyebraw: 'COOKBOOKS',
  title: 'Cookbooks',
  description:
    'Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases',
});

export const metadata: Metadata = {
  title: 'Cookbooks - Mistral AI',
  description:
    "Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases",
  openGraph: {
    title: 'Mistral AI Cookbooks',
    description:
      "Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases",
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

export default function CookbookPage() {
  return (
    <NoSidebarPageLayout>
      {/* Hero Section */}
      <CookbookHeroSection />

      {/* Topics Section */}
      <CookbookTopicsSection />

      {/* Featured Cookbooks */}
      <CookbookFeaturedSection />

      {/* All Cookbooks */}

      <CookbookAllSection />
      <ShowAllCookbooksInlineScript />

      {/* Useful Links */}
      <UsefullLinksSection />
    </NoSidebarPageLayout>
  );
}
