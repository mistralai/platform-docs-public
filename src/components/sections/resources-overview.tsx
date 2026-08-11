'use client';

import { Link } from '@/i18n/navigation.client';
import { FolderIcon, ArrowRightIcon } from '@/components/icons/pixel';
import { SectionTab } from '@/components/layout/section-tab';
import { LatestCookbookCards } from '@/components/common/cookbook-cards';
import { PRODUCT_COLORS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function ResourcesOverview({ showHeader = true }: { showHeader?: boolean }) {
  const l = useLingo();
  const sections = [
    {
      title: 'API Reference',
      description: 'Explore endpoints, authentication, schemas, and errors.',
      href: '/api',
      color: PRODUCT_COLORS['api'],
    },
    {
      title: 'SDKs',
      description: 'Install official SDKs for Python, TypeScript, and other languages.',
      href: '/resources/sdks',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Security advisories',
      description: 'Review security advisories and remediation guidance.',
      href: '/resources/security-advisories',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Release notes',
      description: 'Follow shipped updates across Vibe, Studio, Admin, models, and the API.',
      href: '/resources/release-notes',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Changelogs',
      description: 'Track API updates, model releases, deprecations, and breaking changes.',
      href: '/resources/changelogs',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Cookbooks',
      description: 'Build with step-by-step examples for RAG, function calling, evaluation, and more.',
      href: '/resources/cookbooks',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Ambassadors',
      description: 'Find community programs, examples, and contribution paths.',
      href: '/resources/ambassadors',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Mistral Events ↗',
      description: 'Join Mistral events, meetups, and community sessions.',
      href: 'https://luma.com/mistral.ai',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Glossary',
      description: 'Look up platform, model, API, and billing terms.',
      href: '/resources/glossary',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Error glossary',
      description: 'Map HTTP errors to causes and fixes.',
      href: '/resources/error-glossary',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Known limitations',
      description: 'Review current platform, model, and API constraints.',
      href: '/resources/known-limitations',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Migration guides',
      description: 'Switch from another provider to the Mistral API with minimal code changes.',
      href: '/resources/migration-guides',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: 'Observability integrations',
      description: 'Connect Mistral traces and evaluations to third-party tools.',
      href: '/resources/observability-integrations',
      color: PRODUCT_COLORS['developer'],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          Resources bring together the references, examples, and support material that help you build with Mistral. Start here when you need an SDK, a cookbook, a glossary definition, release notes, migration guidance, or a support reference.
        </p>
      )}
      <SectionTab sectionId="resources-explore">
        {l.text('Explore', { context: 'Heading for developer documentation links' })}
      </SectionTab>
      <p className="text-muted-foreground text-base">
        Find material for implementation, troubleshooting, and migration work.
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

      <SectionTab sectionId="latest-cookbooks">Latest cookbooks</SectionTab>
      <p className="text-muted-foreground text-base">
        Use recent examples to learn implementation patterns and adapt them to your project.
      </p>
      <LatestCookbookCards count={6} />
    </div>
  );
}
