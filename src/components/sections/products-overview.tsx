import Link from 'next/link';
import {
  ArrowRightIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_COLORS, PRODUCT_LOGOS, SECTION_LOGOS } from '@/schema/content/getting-started';
import { SectionTab } from '@/components/layout/section-tab';
import { LeChatQuickstartsGrid } from '@/components/common/le-chat-quickstarts-grid';
import { StudioQuickstartsGrid } from '@/components/common/studio-quickstarts-grid';
import { VibeQuickstartsGrid } from '@/components/common/vibe-quickstarts-grid';

const PRODUCT_SECTIONS = [
  {
    title: 'Le Chat',
    description:
      'Research topics and analyze documents in a collaborative AI workspace. Build custom agents for repeatable workflows.',
    logo: PRODUCT_LOGOS['le-chat'],
    href: '/le-chat/overview',
    color: PRODUCT_COLORS['le-chat'],
  },
  {
    title: 'Studio',
    description:
      'Prototype prompts and call Mistral models via API. Fine-tune on your data and monitor performance from a unified dashboard.',
    logo: PRODUCT_LOGOS['studio'],
    href: '/studio-api/overview',
    color: PRODUCT_COLORS['studio'],
  },
  {
    title: 'Mistral Vibe',
    description:
      'Write, refactor, and scaffold projects from your terminal with an AI coding agent.',
    logo: PRODUCT_LOGOS['mistral-vibe'],
    href: '/mistral-vibe/overview',
    color: PRODUCT_COLORS['mistral-vibe'],
  },
];

export function ProductsOverview({ showCta = false, showHeader = true }: { showCta?: boolean; showHeader?: boolean }) {
  return (
    <div className="flex flex-col gap-8">
      {showHeader && (
        <>
          <div className="flex items-center gap-4">
            <Image src={SECTION_LOGOS['products']} alt="Products" width={40} height={40} />
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">Products</h2>
              <p className="text-muted-foreground text-base">
                Le Chat, Studio, and Mistral Vibe.
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            Use Le Chat to research, analyze documents, and create agents without writing code.
            Build and deploy AI applications through the Studio API and playground.
            Automate coding tasks from your terminal with Mistral Vibe.
          </p>
        </>
      )}
      <SectionTab sectionId="products-quickstarts">Quickstarts</SectionTab>
      <LeChatQuickstartsGrid />
      <StudioQuickstartsGrid />
      <VibeQuickstartsGrid />

      <SectionTab sectionId="products-explore">Explore</SectionTab>
      <p className="text-muted-foreground text-sm">
        Go beyond the quickstarts. Read feature guides, learn configuration options, and find integration patterns for each product.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCT_SECTIONS.map((item) => {
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
                  <div className="mb-2">
                    <Image src={item.logo} alt={item.title} width={36} height={36} className="rounded-lg" />
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

      {showCta && (
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          Go to Products
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
