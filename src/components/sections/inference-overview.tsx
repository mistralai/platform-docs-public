'use client';

import { Link } from '@/i18n/navigation.client';
import { FolderIcon, ArrowRightIcon } from '@/components/icons/pixel';
import { Badge } from '@/components/ui/badge';
import { SectionTab } from '@/components/layout/section-tab';
import { LatestModelCards } from '@/components/common/model-cards';
import { PRODUCT_COLORS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function InferenceOverview({ showHeader = true }: { showHeader?: boolean }) {
  const l = useLingo();
  const sections = [
    {
      title: 'Models',
      description: 'View all models with specifications, benchmarks, and feature comparison.',
      href: '/models',
    },
    {
      title: 'Pricing',
      description: 'Compare model pricing by family.',
      href: '/inference/pricing',
    },
    {
      title: 'Model lifecycle policy',
      description: 'Plan for model maturity stages, aliases, deprecations, and retirement.',
      href: '/inference/model-lifecycle',
    },
    {
      title: 'Regional inference',
      description: 'Route inference requests to a specific region.',
      href: '/inference/regional-inference',
      status: 'GA',
    },
    {
      title: 'Priority tier',
      description: 'Route eligible API requests through a priority queue.',
      href: '/inference/priority-tier',
      status: 'Public Preview',
    },
    {
      title: 'Labs',
      description: 'Explore experimental model releases.',
      href: '/inference/labs',
    },
    {
      title: 'Prompting',
      description: 'Design prompts for model requests.',
      href: '/inference/prompting',
    },
    {
      title: 'Sampling',
      description: 'Tune generation parameters.',
      href: '/inference/sampling',
    },
    {
      title: 'API reference',
      description: 'Review endpoint details.',
      href: '/api',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          Mistral inference is the serving layer for running models through the API. Use it to choose the right model, send low-latency requests, route traffic by region, and control generation behavior with prompting and sampling parameters.
        </p>
      )}
      <SectionTab sectionId="inference-explore">
        {l.text('Explore', { context: 'Heading for model-related documentation' })}
      </SectionTab>
      <p className="text-muted-foreground text-base">
        Find reference material for model choice, pricing, lifecycle, regional routing, and request behavior.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(item => {
          const Icon = FolderIcon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#6F6F84]/50 flex flex-col no-underline hover:no-underline"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

              <div className="flex flex-col h-full gap-3 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className={`p-2 rounded-lg ${PRODUCT_COLORS['docs'].bg} ${PRODUCT_COLORS['docs'].text} mb-2`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#6F6F84] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                    <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#6F6F84] transition-colors">
                    {item.title}
                  </h3>
                  {'status' in item && item.status && (
                    <Badge variant={item.status === 'GA' ? 'outline' : 'yellow'} size="xs" className="font-mono uppercase text-[11px]">
                      {item.status}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <SectionTab sectionId="latest-models">Latest models</SectionTab>
      <LatestModelCards count={6} />
    </div>
  );
}
