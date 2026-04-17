import { Heading, HeadingTitle } from '@/components/layout/heading';
import type { Metadata } from 'next';

import { ProductsOverview } from '@/components/sections/products-overview';
import { DevelopersOverview } from '@/components/sections/developers-overview';
import { AdminOverview } from '@/components/sections/admin-overview';
import { HeroCards } from '@/components/common/hero-cards';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  eyebraw: 'Docs',
  title: 'Documentation',
  description: 'Welcome to Mistral AI\'s Documentation',
  image: '/ogs/docs.png',
});

export const metadata: Metadata = {
  title: 'Documentation - Mistral AI',
  description:
    "Learn how to deploy and use Mistral AI's Large Language Models with our comprehensive documentation, guides, and tutorials.",
  openGraph: {
    title: 'Mistral AI Documentation',
    description:
      "Learn how to deploy and use Mistral AI's Large Language Models with our comprehensive documentation, guides, and tutorials.",
    url: 'https://docs.mistral.ai',
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
    card: 'summary_large_image',
    title: 'Mistral AI Documentation',
    description:
      "Learn how to deploy and use Mistral AI's Large Language Models with our comprehensive documentation, guides, and tutorials.",
    images: [ogImageUrl],
  },
};

export default function DocumentationPage() {
  return (
    <div className="space-y-16 not-prose pb-20">
      {/* Hero Section */}
      <div className="relative flex flex-col xl:flex-row gap-8 xl:gap-16 mt-12 mb-12 items-center justify-between w-full overflow-visible">
        <div className="flex flex-col gap-6 z-10 flex-1 max-w-full xl:max-w-[60%]">
          <Heading>
            <HeadingTitle
              className="font-black tracking-tight leading-[1.1] text-foreground max-xl:text-center text-balance text-[clamp(1.5rem,4vw,3rem)]"
              size="h1"
              as="h1"
            >
              Mistral AI Documentation
            </HeadingTitle>
          </Heading>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl leading-relaxed font-medium max-xl:text-center max-xl:mx-auto">
            All our documentation in your hands: build, customize, and deploy AI, your way.
          </p>
        </div>
        
        <div className="w-full xl:w-[40%] flex justify-end xl:pr-8">
          <HeroCards />
        </div>
      </div>

      <hr className="border-primary-soft/30" />

      {/* Products */}
      <section id="products" className="flex flex-col gap-8">
        <ProductsOverview />
      </section>

      <hr className="border-primary-soft/30" />

      {/* Developers */}
      <section id="developers" className="flex flex-col gap-8">
        <DevelopersOverview />
      </section>

      <hr className="border-primary-soft/30" />

      {/* Admin */}
      <section id="admin" className="flex flex-col gap-8">
        <AdminOverview />
      </section>

    </div>
  );
}
