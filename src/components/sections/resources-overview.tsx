'use client';

import { Link, useLocale } from '@/i18n/navigation.client';
import { FolderIcon, ArrowRightIcon } from '@/components/icons/pixel';
import { SectionTab } from '@/components/layout/section-tab';
import { LatestCookbookCards } from '@/components/common/cookbook-cards';
import { PRODUCT_COLORS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function ResourcesOverview({ showHeader = true }: { showHeader?: boolean }) {
  const l = useLingo();
  const locale = useLocale();
  const apiLabel =
    locale === 'fr'
      ? l.text('API', {
          context: 'Title of the Resources landing card linking to the API reference',
        })
      : 'API Reference';
  const sections = [
    {
      title: apiLabel,
      description: l.text('Explore endpoints, authentication, schemas, and errors.', {
        context: 'Description of the Resources landing card linking to the API reference',
      }),
      href: '/api',
      color: PRODUCT_COLORS['api'],
    },
    {
      title: l.text('SDKs', {
        context: 'Title of the Resources landing card linking to SDKs',
      }),
      description: l.text('Install official SDKs for Python, TypeScript, and other languages.', {
        context: 'Description of the Resources landing card linking to SDKs',
      }),
      href: '/resources/sdks',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Security advisories', {
        context: 'Title of the Resources landing card linking to security advisories',
      }),
      description: l.text('Review security advisories and remediation guidance.', {
        context: 'Description of the Resources landing card linking to security advisories',
      }),
      href: '/resources/security-advisories',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Release notes', {
        context: 'Title of the Resources landing card linking to release notes',
      }),
      description: l.text('Follow shipped updates across Vibe, Studio, Admin, models, and the API.', {
        context: 'Description of the Resources landing card linking to release notes',
      }),
      href: '/resources/release-notes',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Changelogs', {
        context: 'Title of the Resources landing card linking to changelogs',
      }),
      description: l.text('Track API updates, model releases, deprecations, and breaking changes.', {
        context: 'Description of the Resources landing card linking to changelogs',
      }),
      href: '/resources/changelogs',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Cookbooks', {
        context: 'Title of the Resources landing card linking to cookbooks',
      }),
      description: l.text('Build with step-by-step examples for RAG, function calling, evaluation, and more.', {
        context: 'Description of the Resources landing card linking to cookbooks',
      }),
      href: '/resources/cookbooks',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Ambassadors', {
        context: 'Title of the Resources landing card linking to the ambassador program',
      }),
      description: l.text('Find community programs, examples, and contribution paths.', {
        context: 'Description of the Resources landing card linking to the ambassador program',
      }),
      href: '/resources/ambassadors',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Mistral Events ↗', {
        context: 'Title of the Resources landing card linking to Mistral events',
      }),
      description: l.text('Join Mistral events, meetups, and community sessions.', {
        context: 'Description of the Resources landing card linking to Mistral events',
      }),
      href: 'https://luma.com/mistral.ai',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Glossary', {
        context: 'Title of the Resources landing card linking to the glossary',
      }),
      description: l.text('Look up platform, model, API, and billing terms.', {
        context: 'Description of the Resources landing card linking to the glossary',
      }),
      href: '/resources/glossary',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Error glossary', {
        context: 'Title of the Resources landing card linking to the error glossary',
      }),
      description: l.text('Map HTTP errors to causes and fixes.', {
        context: 'Description of the Resources landing card linking to the error glossary',
      }),
      href: '/resources/error-glossary',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Known limitations', {
        context: 'Title of the Resources landing card linking to known limitations',
      }),
      description: l.text('Review current platform, model, and API constraints.', {
        context: 'Description of the Resources landing card linking to known limitations',
      }),
      href: '/resources/known-limitations',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Migration guides', {
        context: 'Title of the Resources landing card linking to migration guides',
      }),
      description: l.text('Switch from another provider to the Mistral API with minimal code changes.', {
        context: 'Description of the Resources landing card linking to migration guides',
      }),
      href: '/resources/migration-guides',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Observability integrations', {
        context: 'Title of the Resources landing card linking to observability integrations',
      }),
      description: l.text('Connect Mistral traces and evaluations to third-party tools.', {
        context: 'Description of the Resources landing card linking to observability integrations',
      }),
      href: '/resources/observability-integrations',
      color: PRODUCT_COLORS['developer'],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          {l.text(
            'Resources bring together the references, examples, and support material that help you build with Mistral. Start here when you need an SDK, a cookbook, a glossary definition, release notes, migration guidance, or a support reference.',
            { context: 'Introductory description for the Resources landing page' }
          )}
        </p>
      )}
      <SectionTab sectionId="resources-explore">
        {l.text('Explore', { context: 'Heading for developer documentation links' })}
      </SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('Find material for implementation, troubleshooting, and migration work.', {
          context: 'Intro text for Resources landing page cards',
        })}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(item => {
          const Icon = FolderIcon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#0082E6]/50 flex flex-col no-underline hover:no-underline"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

              <div className="flex flex-col h-full gap-3 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className={`p-2 rounded-lg ${item.color.bg} ${item.color.text} mb-2`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#0082E6] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                    <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#0082E6] transition-colors">
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

      <SectionTab sectionId="latest-cookbooks">
        {l.text('Latest cookbooks', {
          context: 'Heading for the latest cookbooks section on the Resources landing page',
        })}
      </SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text(
          'Use recent examples to learn implementation patterns and adapt them to your project.',
          { context: 'Intro text for the latest cookbooks section on the Resources landing page' }
        )}
      </p>
      <LatestCookbookCards count={6} />
    </div>
  );
}
