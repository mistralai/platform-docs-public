import { Heading, HeadingTitle } from '@/components/layout/heading';
import { FeatureCard } from '@/components/common/feature-card';
import { ModelCard } from '@/components/model/model-card';
import { Button } from '@/components/ui/button';
import { ModelAvatar } from '@/components/model/avatar';
import type { Metadata } from 'next';

import { getModelUrl, nonLegacyModels } from '@/schema';
import { MODEL_COLORS } from '@/lib/colors';
import { AVATAR_ICONS } from '@/lib/icons';
import ArrowRightIcon from '@/components/icons/pixel/arrow-right';

import { SectionTab } from '@/components/layout/section-tab';
import UsefullLinksSection from '@/components/sections/usefull-links';
import {
  BUILDING_FEATURES,
  HERO_AVATAR_CARDS,
} from '@/schema/content/getting-started';
import {
  FEATURED_MODEL_NAMES,
  LATEST_MODEL_NAMES,
  FEATURED_MODELS_COLOR_OVERRIDES,
} from '@/schema/content/models';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import Link from 'next/link';

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  eyebraw: 'Docs',
  title: 'Documentation',
  description: 'Bienvenue to Mistral AI’s Documentation',
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

// Create a union type of all available model names for autocompletion

const featuredModels = FEATURED_MODEL_NAMES.map(
  slug => nonLegacyModels.find(model => model.slug === slug)!
).filter(Boolean);

const latestModels = LATEST_MODEL_NAMES.map(
  slug => nonLegacyModels.find(model => model.slug === slug)!
).filter(Boolean);

const heroAvatarCards = nonLegacyModels
  .filter(model => HERO_AVATAR_CARDS.includes(model.slug)!)
  .filter(Boolean);

export default function DocumentationPage() {
  return (
    <div className="space-y-14 not-prose">
      {/* Hero Section */}
      <div className="relative flex flex-col gap-10 md:flex-row items-center justify-center md:justify-between !mt-4 mb-16">
        <Heading className="max-w-2xl max-md:max-w-xl">
          <HeadingTitle
            className="text-balance max-md:text-center"
            size="h1"
            as="h1"
          >
            Bienvenue to Mistral AI Documentation
          </HeadingTitle>
        </Heading>

        <div className="flex -space-x-4">
          {heroAvatarCards.map((card, index) => {
            const iconPath = card.avatar
              ? AVATAR_ICONS[card.avatar.icon]
              : null;
            const modelColorVar =
              FEATURED_MODELS_COLOR_OVERRIDES[index] ||
              (card.avatar ? MODEL_COLORS[card.avatar.backgroundColor] : null);

            // Define rotations for each avatar
            const rotations = [
              'rotate-[0deg]',
              '-rotate-[6deg] translate-y-4',
              'rotate-[4deg] -translate-y-2',
            ];

            const rotation = rotations[index];

            return (
              <div
                key={card.name}
                className={`group relative transition-transform duration-200 hover:scale-105 ${rotation}`}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ModelAvatar
                      href={getModelUrl(card)}
                      src={iconPath || '/assets/models/Mistral_7B.svg'}
                      alt={`${card.name} icon`}
                      size="3xl"
                      style={
                        {
                          '--model-color': modelColorVar,
                        } as React.CSSProperties
                      }
                      className="ring-[var(--model-color)] ring ring-offset-2 ring-offset-background border-none shadow-none xl:size-32"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{card.name}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Models Section */}
      <section id="featured-models" className="flex flex-col gap-6">
        <SectionTab sectionId="featured-models">Featured models</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredModels.map((model, index) => (
            <ModelCard
              overrideColor={FEATURED_MODELS_COLOR_OVERRIDES[index]}
              key={model.name}
              variant="card"
              showParameters={false}
              model={model}
            />
          ))}
        </div>
      </section>

      {/* Latest Models Section */}
      <section id="latest-models" className="flex flex-col gap-6">
        <SectionTab sectionId="latest-models">Latest models</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestModels.map(model => (
            <ModelCard
              key={model.name}
              model={model}
              variant="compact"
              showParameters={true}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button size="sm" asChild>
            <Link href="/getting-started/models">
              View all models <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Start Building Section */}
      <section id="start-building" className="flex flex-col gap-6">
        <SectionTab sectionId="start-building">Start building</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUILDING_FEATURES.map(feature => (
            <FeatureCard
              key={feature.href}
              as={Link}
              href={feature.href}
              variant="outline"
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>

      <UsefullLinksSection />
    </div>
  );
}
