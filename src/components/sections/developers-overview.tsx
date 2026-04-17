import Link from 'next/link';
import { DeveloperQuickstartsGrid } from '@/components/common/developer-quickstarts-grid';
import {
  PlugIcon,
  DownloadIcon,
  FireIcon,
  BellIcon,
  ArrowRightIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_COLORS, SECTION_LOGOS } from '@/schema/content/getting-started';
import { SectionTab } from '@/components/layout/section-tab';

const DEVELOPER_SECTIONS = [
  {
    title: 'API Reference',
    description:
      'Explore the Mistral API: endpoints, authentication, request/response schemas, and error handling.',
    icon: PlugIcon,
    href: '/api',
    color: PRODUCT_COLORS['api'],
  },
  {
    title: 'SDKs',
    description:
      'Install official SDKs for Python, TypeScript, and other languages to integrate Mistral models.',
    icon: DownloadIcon,
    href: '/resources/sdks',
    color: PRODUCT_COLORS['developer'],
  },
  {
    title: 'Cookbooks',
    description:
      'Build with step-by-step code walkthroughs for RAG, function calling, fine-tuning, and other integration patterns.',
    icon: FireIcon,
    href: '/resources/cookbooks',
    color: PRODUCT_COLORS['developer'],
  },
  {
    title: 'Changelogs',
    description:
      'Track API updates, new model releases, deprecations, and breaking changes.',
    icon: BellIcon,
    href: '/resources/changelogs',
    color: PRODUCT_COLORS['developer'],
  },
];

export function DevelopersOverview({ showCta = false, showHeader = true }: { showCta?: boolean; showHeader?: boolean }) {
  return (
    <div className="flex flex-col gap-8">
      {showHeader && (
        <>
          <div className="flex items-center gap-4">
            <Image src={SECTION_LOGOS['developer']} alt="Developers" width={40} height={40} />
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">Developers</h2>
              <p className="text-muted-foreground text-base">
                Build with Mistral models using the API, SDKs, and code examples.
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            Start with a quickstart to send your first API request, then explore the full
            API reference, install an SDK, or browse cookbooks for production-ready patterns.
          </p>
        </>
      )}
      <SectionTab sectionId="developers-quickstarts">Quickstarts</SectionTab>
      <DeveloperQuickstartsGrid />

      <SectionTab sectionId="developers-explore">Explore</SectionTab>
      <p className="text-muted-foreground text-sm">
        Dive into endpoint specifications, grab a client SDK for your language, and walk through cookbook examples for common integration patterns.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEVELOPER_SECTIONS.map((item) => {
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

      {showCta && (
        <Link
          href="/developers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          Go to Developers
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
