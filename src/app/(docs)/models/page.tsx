import { Heading, HeadingTitle } from '@/components/layout/heading';
import { ModelCard } from '@/components/model/model-card';
import { SectionTab } from '@/components/layout/section-tab';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  PageIcon,
  StatsIcon,
  RockIcon,
  SearchIcon,
  ArrowRightIcon,
} from '@/components/icons/pixel';

import { nonLegacyModels } from '@/schema';
import { PRODUCT_COLORS } from '@/schema/content/getting-started';
import {
  LATEST_MODEL_NAMES,
} from '@/schema/content/models';

const latestModels = LATEST_MODEL_NAMES.map(
  slug => nonLegacyModels.find(model => model.slug === slug)!
).filter(Boolean);

const EXPLORE_SECTIONS = [
  {
    title: 'Overview',
    description:
      'View all models with specifications, benchmarks, and feature comparison.',
    icon: PageIcon,
    href: '/models/overview',
    color: PRODUCT_COLORS['models'],
  },
  {
    title: 'Model selection guide',
    description:
      'Choose the right model based on task requirements, latency constraints, and cost targets.',
    icon: SearchIcon,
    href: '/models/model-selection-guide',
    color: PRODUCT_COLORS['models'],
  },
  {
    title: 'Deployment',
    description:
      'Deploy models to cloud providers and Mistral Compute.',
    icon: RockIcon,
    href: '/models/deployment',
    color: PRODUCT_COLORS['models'],
  },
  {
    title: 'Best practices',
    description:
      'Prompt engineering, sampling parameter tuning, evaluation methods, and fine-tuning workflows.',
    icon: StatsIcon,
    href: '/models/best-practices',
    color: PRODUCT_COLORS['models'],
  },
];

export default function ModelsLandingPage() {
  return (
    <div className="space-y-14 not-prose">
      {/* Header */}
      <Heading className="max-w-2xl !mt-4">
        <HeadingTitle
          className="text-balance"
          size="h1"
          as="h1"
        >
          Models
        </HeadingTitle>
        <p className="text-muted-foreground text-lg">
          Mistral develops open-weight and commercial large language models.
          Explore the full lineup, compare benchmarks, and find the right
          model for your use case.
        </p>
      </Heading>

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
            <Link href="/models/overview">
              View all models <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Explore */}
      <section id="explore" className="flex flex-col gap-6">
        <SectionTab sectionId="models-explore">Explore</SectionTab>
        <p className="text-muted-foreground text-sm">
          Compare specifications and benchmarks, find the right model for your task, and learn how to deploy across cloud providers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPLORE_SECTIONS.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline"
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
                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors transition-transform duration-300 group-hover:scale-110">
                      <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-primary transition-colors">
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
    </div>
  );
}
