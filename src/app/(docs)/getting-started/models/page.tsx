import {
  Heading,
  HeadingCTAs,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { ModelCard } from '@/components/model/model-card';
import { Button } from '@/components/ui/button';
import { SectionTab } from '@/components/layout/section-tab';
import { ModelTable } from '@/components/model/model-table';
import { models, nonLegacyModels } from '@/schema';
import {
  FEATURED_MODEL_NAMES_MODELS_PAGE,
  FEATURED_MODELS_COLOR_OVERRIDES,
} from '@/schema/content/models';
import { Bullet } from '@/components/ui/bullet';
import Link from 'next/link';
import UsefullLinksSection from '@/components/sections/usefull-links';
import ArrowRightIcon from '@/components/icons/pixel/arrow-right';
import { MISTRAL_URL } from '@/lib/constants';

export default function ModelsPage() {
  // Filter models by type

  const frontierModels = nonLegacyModels.filter(
    model => model.type === 'Frontier'
  );

  const openModels = nonLegacyModels.filter(model => model.type === 'Open');

  const featuredModels = FEATURED_MODEL_NAMES_MODELS_PAGE.map(
    slug => models.find(model => model.slug === slug)!
  ).filter(Boolean);

  // Legacy/Deprecated models
  const legacyModels = models.filter(
    model => model.status === 'Deprecated' || model.status === 'Retired'
  );

  return (
    <div className="mx-auto space-y-14 w-full md:pt-8 not-prose">
      {/* Page Header */}
      <div className="space-y-4">
        <Heading align="center">
          <HeadingTitle as="h1">Models</HeadingTitle>
          <HeadingSubtitle>
            This guide will explore the performance and cost trade-offs, and
            discuss how to select the appropriate model for different use cases.
            We will delve into various factors to consider, offering guidance on
            choosing the right model for your specific needs.
          </HeadingSubtitle>
          <HeadingCTAs>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold font-mono uppercase text-xs"
            >
              <Link href="https://discord.gg/mistral" target="_blank">
                <Bullet />
                Join our Discord ↗
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`${MISTRAL_URL}/contact`}>
                Reach out
                <ArrowRightIcon className="size-5" />
              </Link>
            </Button>
          </HeadingCTAs>
        </Heading>
      </div>

      {/* Featured Models Section */}
      <section id="featured-models" className="flex flex-col gap-6">
        <SectionTab sectionId="featured-models">Featured Models</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredModels.map((model, index) => (
            <ModelCard
              overrideColor={FEATURED_MODELS_COLOR_OVERRIDES[index]}
              key={model.name}
              model={model}
              variant="card"
              showParameters={false}
            />
          ))}
        </div>
      </section>

      {/* Frontier Models Section */}

      <section id="frontier-models" className="flex flex-col gap-6">
        <SectionTab>All Models</SectionTab>

        <Heading align="between">
          <HeadingTitle as="h3">Frontier Models</HeadingTitle>
          <HeadingSubtitle>
            Frontier and Commercial-Grade AI Solutions for Advanced Applications
          </HeadingSubtitle>
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frontierModels.map(model => (
            <ModelCard
              key={model.name}
              model={model}
              variant="compact"
              showParameters={true}
            />
          ))}
        </div>
      </section>

      {/* Open Models Section */}
      <section id="open-models" className="flex flex-col gap-6">
        <Heading align="between">
          <HeadingTitle as="h3">Open Models</HeadingTitle>
          <HeadingSubtitle>
            Open-Source AI Models for Community and Research Use
          </HeadingSubtitle>
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openModels.map(model => (
            <ModelCard
              key={model.name}
              model={model}
              variant="compact"
              showParameters={true}
            />
          ))}
        </div>
      </section>

      {/* Deprecated Models Section */}
      <section id="legacy-models" className="flex flex-col gap-6">
        <SectionTab variant="secondary" sectionId="legacy-models">
          Legacy/Deprecated
        </SectionTab>
        <Heading align="between">
          <HeadingTitle as="h3" className="text-2xl 2xl:text-3xl">
            Legacy Models
          </HeadingTitle>
          <HeadingSubtitle className="md:text-right">
            Our model offering is continuously refreshed with newer, better
            models. As part of this process, we deprecate and retire older
            models.
          </HeadingSubtitle>
        </Heading>
        <ModelTable data={legacyModels} forceDeprecated />
      </section>

      {/* Usefull Links */}
      <UsefullLinksSection />
    </div>
  );
}
