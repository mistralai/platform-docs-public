'use client';

import { Link, useLocale } from '@/i18n/navigation.client';
import { FolderIcon, ArrowRightIcon } from '@/components/icons/pixel';
import { Badge } from '@/components/ui/badge';
import { SectionTab } from '@/components/layout/section-tab';
import { LatestModelCards } from '@/components/common/model-cards';
import { PRODUCT_COLORS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function InferenceOverview({ showHeader = true }: { showHeader?: boolean }) {
  const l = useLingo();
  const locale = useLocale();
  const apiLabel =
    locale === 'fr'
      ? l.text('API', {
          context: 'Title of the Inference landing card linking to the API reference',
        })
      : 'API Reference';
  const sections = [
    {
      title: l.text('Models', {
        context: 'Title of the Inference landing card linking to the model catalog',
      }),
      description: l.text(
        'View all models with specifications, benchmarks, and feature comparison.',
        {
          context: 'Description of the Inference landing card linking to the model catalog',
        }
      ),
      href: '/models',
    },
    {
      title: l.text('Pricing', {
        context: 'Title of the Inference landing card linking to model pricing',
      }),
      description: l.text('Compare model pricing by family.', {
        context: 'Description of the Inference landing card linking to model pricing',
      }),
      href: '/inference/pricing',
    },
    {
      title: l.text('Model lifecycle policy', {
        context: 'Title of the Inference landing card linking to the model lifecycle policy',
      }),
      description: l.text(
        'Plan for model maturity stages, aliases, deprecations, and retirement.',
        {
          context: 'Description of the Inference landing card linking to the model lifecycle policy',
        }
      ),
      href: '/inference/model-lifecycle',
    },
    {
      title: l.text('Regional inference', {
        context: 'Title of the Inference landing card linking to regional inference',
      }),
      description: l.text('Route inference requests to a specific region.', {
        context: 'Description of the Inference landing card linking to regional inference',
      }),
      href: '/inference/regional-inference',
      status: l.text('GA', {
        context: 'Lifecycle status label for a generally available inference feature',
      }),
      statusVariant: 'outline' as const,
    },
    {
      title: l.text('Priority tier', {
        context: 'Title of the Inference landing card linking to Priority tier',
      }),
      description: l.text('Route eligible API requests through a priority queue.', {
        context: 'Description of the Inference landing card linking to Priority tier',
      }),
      href: '/inference/priority-tier',
      status: l.text('Public Preview', {
        context: 'Lifecycle status label for a public preview inference feature',
      }),
      statusVariant: 'yellow' as const,
    },
    {
      title: l.text('Labs', {
        context: 'Title of the Inference landing card linking to Labs',
      }),
      description: l.text('Explore experimental model releases.', {
        context: 'Description of the Inference landing card linking to Labs',
      }),
      href: '/inference/labs',
    },
    {
      title: l.text('Prompting', {
        context: 'Title of the Inference landing card linking to prompting guidance',
      }),
      description: l.text('Design prompts for model requests.', {
        context: 'Description of the Inference landing card linking to prompting guidance',
      }),
      href: '/inference/prompting',
    },
    {
      title: l.text('Sampling', {
        context: 'Title of the Inference landing card linking to sampling guidance',
      }),
      description: l.text('Tune generation parameters.', {
        context: 'Description of the Inference landing card linking to sampling guidance',
      }),
      href: '/inference/sampling',
    },
    {
      title: apiLabel,
      description: l.text('Review endpoint details.', {
        context: 'Description of the Inference landing card linking to the API reference',
      }),
      href: '/api',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          {l.text(
            'Mistral inference is the serving layer for running models through the API. Use it to choose the right model, send low-latency requests, route traffic by region, and control generation behavior with prompting and sampling parameters.',
            { context: 'Introductory description for the Inference landing page' }
          )}
        </p>
      )}
      <SectionTab sectionId="inference-explore">
        {l.text('Explore', { context: 'Heading for model-related documentation' })}
      </SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text(
          'Find reference material for model choice, pricing, lifecycle, regional routing, and request behavior.',
          { context: 'Intro text for Inference landing page cards' }
        )}
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
                    <Badge variant={item.statusVariant} size="xs" className="font-mono uppercase text-[11px]">
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

      <SectionTab sectionId="latest-models">
        {l.text('Latest models', {
          context: 'Heading for the latest models section on the Inference landing page',
        })}
      </SectionTab>
      <LatestModelCards count={6} />
    </div>
  );
}
