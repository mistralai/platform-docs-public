import { Heading, HeadingTitle } from '@/components/layout/heading';
import { ModelCard } from '@/components/model/model-card';
import { SectionTab } from '@/components/layout/section-tab';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation.client';
import {
  FolderIcon,
  ArrowRightIcon,
} from '@/components/icons/pixel';

import { nonLegacyModels } from '@/schema';
import { PRODUCT_COLORS } from '@/schema/content/getting-started';
import {
  LATEST_MODEL_NAMES,
} from '@/schema/content/models';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

const latestModels = LATEST_MODEL_NAMES.map(
  slug => nonLegacyModels.find(model => model.slug === slug)!
).filter(Boolean);

export default async function ModelsLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const EXPLORE_SECTIONS = [
    {
      title: l.text('Overview', { context: 'Title of a navigation card to the full AI model catalog' }),
      description: l.text('View all models with specifications, benchmarks, and feature comparison.', { context: 'Description of the navigation card to the full AI model catalog' }),
      icon: FolderIcon,
      href: '/models/overview',
      color: PRODUCT_COLORS['docs'],
    },
    {
      title: l.text('Model selection guide', { context: 'Title of a navigation card to the model selection guide' }),
      description: l.text('Choose the right model based on task requirements, latency constraints, and cost targets.', { context: 'Description of the navigation card to the model selection guide' }),
      icon: FolderIcon,
      href: '/models/model-selection-guide',
      color: PRODUCT_COLORS['docs'],
    },
    {
      title: l.text('Deployment', { context: 'Title of a navigation card to AI model deployment docs' }),
      description: l.text('Deploy models to cloud providers and Mistral Compute.', { context: 'Description of the navigation card to AI model deployment docs' }),
      icon: FolderIcon,
      href: '/models/deployment',
      color: PRODUCT_COLORS['docs'],
    },
    {
      title: l.text('Best practices', { context: 'Title of a navigation card to AI model best practices' }),
      description: l.text('Prompt engineering, sampling parameter tuning, and evaluation methods.', { context: 'Description of the navigation card to AI model best practices' }),
      icon: FolderIcon,
      href: '/models/best-practices',
      color: PRODUCT_COLORS['docs'],
    },
  ];
  return (
    <div className="space-y-14 not-prose">
      {/* Header */}
      <Heading className="max-w-2xl !mt-4">
        <HeadingTitle
          className="text-balance"
          size="h1"
          as="h1"
        >
          {l.text('Models', { context: 'Label for AI models' })}
        </HeadingTitle>
        <p className="text-muted-foreground text-lg">
          {l.text('Mistral develops open-weight and commercial large language models. Explore the full lineup, compare benchmarks, and find the right model for your use case.', { context: 'Introductory description of Mistral AI models' })}
        </p>
      </Heading>

      {/* Explore */}
      <section id="explore" className="flex flex-col gap-6">
        <SectionTab sectionId="models-explore">{l.text('Explore', { context: 'Heading for model-related documentation' })}</SectionTab>
        <p className="text-muted-foreground text-base">
          {l.text('Compare specifications and benchmarks, find the right model for your task, and learn how to deploy across cloud providers.', { context: 'Intro text for model-related documentation links' })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPLORE_SECTIONS.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#6F6F84]/50 flex flex-col no-underline hover:no-underline"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

                <div className="flex flex-col h-full gap-3 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`p-2 rounded-lg ${item.color.bg} ${item.color.text} mb-2`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#6F6F84] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                      <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#6F6F84] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Models Section */}
      <section id="latest-models" className="flex flex-col gap-6">
        <SectionTab sectionId="latest-models">{l.text('Latest models', { context: 'Heading for the newest AI models' })}</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestModels.map(model => (
            <ModelCard
              key={model.name}
              l={l}
              model={model}
              variant="compact"
              showParameters={true}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button size="sm" asChild>
            <Link href="/models/overview">
              {l.text('View all models', { context: 'Call to view the full AI model catalog' })} <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
