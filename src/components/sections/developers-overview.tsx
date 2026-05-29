'use client';

import { Link } from '@/i18n/navigation.client';
import { QuickstartsFilterableGrid } from '@/components/common/quickstarts-filterable-grid';
import {
  FolderIcon,
  ArrowRightIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_COLORS, SECTION_LOGOS } from '@/schema/content/getting-started';
import { SectionTab } from '@/components/layout/section-tab';
import { useLingo } from '@lingo.dev/react';

export function DevelopersOverview({ showCta = false, showHeader = true }: { locale?: string; showCta?: boolean; showHeader?: boolean }) {
  const l = useLingo();
  const DEVELOPER_SECTIONS = [
    {
      title: l.text('API Reference', { context: 'Title of a documentation card about API Reference' }),
      description: l.text('Explore the Mistral API: endpoints, authentication, request/response schemas, and error handling.', { context: 'Description of a documentation card about API Reference' }),
      icon: FolderIcon,
      href: '/api',
      color: PRODUCT_COLORS['api'],
    },
    {
      title: l.text('SDKs', { context: 'Title of a documentation card about SDKs' }),
      description: l.text('Install official SDKs for Python, TypeScript, and other languages to integrate Mistral models.', { context: 'Description of a documentation card about SDKs' }),
      icon: FolderIcon,
      href: '/resources/sdks',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Cookbooks', { context: 'Title of a documentation card about Cookbooks' }),
      description: l.text('Build with step-by-step code walkthroughs for RAG, function calling, fine-tuning, and other integration patterns.', { context: 'Description of a documentation card about Cookbooks' }),
      icon: FolderIcon,
      href: '/resources/cookbooks',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Changelogs', { context: 'Title of a documentation card about Changelogs' }),
      description: l.text('Track API updates, new model releases, deprecations, and breaking changes.', { context: 'Description of a documentation card about Changelogs' }),
      icon: FolderIcon,
      href: '/resources/changelogs',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Vibe Code', { context: 'Title of a documentation card linking to Vibe Code from the developers overview' }),
      description: l.text('Mistral\'s coding mode. CLI, VS Code extension, and remote web sessions to write code with an agent.', { context: 'Description of the Vibe Code card on the developers overview' }),
      icon: FolderIcon,
      href: '/vibe/code/overview',
      color: PRODUCT_COLORS['developer'],
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      {showHeader && (
        <>
          <div className="flex items-center gap-4">
            <Image src={SECTION_LOGOS['developer']} alt={l.text('Developers', { context: 'Alt text for the Developers section logo' })} width={40} height={40} />
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">{l.text('Developers', { context: 'Heading for developer documentation' })}</h2>
              <p className="text-muted-foreground text-base">
                {l.text('Build with Mistral models using the API, SDKs, and code examples.', { context: 'Subtitle for developer documentation' })}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            {l.text('Start with a quickstart to send your first API request, then explore the full API reference, install an SDK, or browse cookbooks for production-ready patterns.', { context: 'Introductory description of developer docs' })}
          </p>
        </>
      )}
      <SectionTab sectionId="developers-explore">{l.text('Explore', { context: 'Heading for developer documentation links' })}</SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('Endpoint specifications, client SDKs for every language, and cookbook examples for common integration patterns.', { context: 'Intro text for developer documentation links' })}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEVELOPER_SECTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#0082E6]/50 flex flex-col no-underline hover:no-underline"
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

      <SectionTab sectionId="developers-quickstarts">{l.text('Quickstarts', { context: 'Heading for developer quickstarts' })}</SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('Hands-on guides to activate Studio, send your first request, build agents, run RAG, and wire workflows. Most take 15 minutes or less.', { context: 'Intro text for developer quickstarts on the developers overview page' })}
      </p>
      <QuickstartsFilterableGrid categories={['developer', 'studio']} />

      {showCta && (
        <Link
          href="/developers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          {l.text('Go to Developers', { context: 'Call to open the developer docs section' })}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
