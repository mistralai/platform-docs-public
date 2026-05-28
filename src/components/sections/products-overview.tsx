'use client';

import { Link } from '@/i18n/navigation.client';
import {
  ArrowRightIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_COLORS, PRODUCT_LOGOS, SECTION_LOGOS } from '@/schema/content/getting-started';
import { SectionTab } from '@/components/layout/section-tab';
import { QuickstartsFilterableGrid } from '@/components/common/quickstarts-filterable-grid';
import { useLingo } from '@lingo.dev/react';

export function ProductsOverview({ showCta = false, showHeader = true }: { locale?: string; showCta?: boolean; showHeader?: boolean }) {
  const l = useLingo();
  const PRODUCT_SECTIONS = [
    {
      title: 'Vibe',
      description: l.text("Mistral's unified agent. Work mode for productivity in the chat UI, Code mode for the terminal and editor, Chat mode for quick conversations.", { context: 'Description of the Vibe product' }),
      logo: PRODUCT_LOGOS['vibe'],
      href: '/vibe/overview',
      color: PRODUCT_COLORS['vibe'],
      hoverBorder: 'hover:border-[#FA500F]/50',
      hoverText: 'group-hover:text-[#FA500F]',
      hoverBg: 'group-hover:bg-[#FA500F]',
    },
    {
      title: 'Studio',
      description: l.text('Prototype prompts and call Mistral models via API. Fine-tune on your data and monitor performance from a unified dashboard.', { context: 'Description of the Studio product' }),
      logo: PRODUCT_LOGOS['studio'],
      href: '/studio-api/overview',
      color: PRODUCT_COLORS['studio'],
      hoverBorder: 'hover:border-[#0082E6]/50',
      hoverText: 'group-hover:text-[#0082E6]',
      hoverBg: 'group-hover:bg-[#0082E6]',
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      {showHeader && (
        <>
          <div className="flex items-center gap-4">
            <Image src={SECTION_LOGOS['products']} alt={l.text('Products', { context: 'Alt text for the Products section logo' })} width={40} height={40} />
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">{l.text('Products', { context: 'Heading for product documentation' })}</h2>
              <p className="text-muted-foreground text-base">
                {l.text('Vibe and Studio.', { context: 'Subtitle naming the main Mistral products' })}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            {l.text("Use Vibe to research, analyze documents, code, and run multi-step tasks across your tools. Build and deploy AI applications through the Studio API and Playground.", { context: 'Introductory description of Mistral products' })}
          </p>
        </>
      )}
      <SectionTab sectionId="products-explore">{l.text('Explore', { context: 'Heading for product documentation links' })}</SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('Browse the documentation for each product. Feature guides, configuration options, and integration patterns.', { context: 'Intro text for product documentation links' })}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCT_SECTIONS.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline ${item.hoverBorder}`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

              <div className="flex flex-col h-full gap-3 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="mb-2">
                    <Image src={item.logo} alt={item.title} width={36} height={36} className="rounded-lg" />
                  </div>
                  <div className={`shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110 ${item.hoverBg}`}>
                    <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className={`font-bold text-xl tracking-tight leading-tight text-foreground transition-colors ${item.hoverText}`}>
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

      <SectionTab sectionId="products-quickstarts">{l.text('Quickstarts', { context: 'Heading for product quickstarts' })}</SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('Hands-on guides to get you running on each product. Most take 15 minutes or less.', { context: 'Intro text for product quickstarts on the products overview page' })}
      </p>

      <QuickstartsFilterableGrid categories={['vibe-work', 'vibe-code', 'studio', 'developer']} />

      {showCta && (
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          {l.text('Go to Products', { context: 'Footer CTA link on the Products overview that navigates to the Products section' })}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
