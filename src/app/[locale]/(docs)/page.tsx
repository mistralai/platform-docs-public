import { Heading, HeadingTitle } from '@/components/layout/heading';
import type { Metadata } from 'next';

import { Link } from '@/i18n/navigation.client';
import { Button } from '@/components/ui/button';
import { HeroCards } from '@/components/common/hero-cards';
import { SectionTab } from '@/components/layout/section-tab';
import { ModelCard } from '@/components/model/model-card';
import Image from 'next/image';
import { ArrowRightIcon } from '@/components/icons/pixel';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { QuickstartsFilterableGrid } from '@/components/common/quickstarts-filterable-grid';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';
import { nonLegacyModels } from '@/schema';
import { LATEST_MODEL_NAMES } from '@/schema/content/models';

const latestModels = LATEST_MODEL_NAMES.map(
  slug => nonLegacyModels.find(model => model.slug === slug)!
).filter(Boolean);

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  eyebraw: 'Docs',
  title: 'Documentation',
  description: 'Welcome to Mistral AI\'s Documentation',
  image: '/ogs/docs.png',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const tabTitle = l.text('Documentation - Mistral AI', { context: 'Page title for the documentation home page' });
  const socialTitle = l.text('Mistral AI Documentation', { context: 'Main heading for the documentation home page' });
  const description = l.text("Learn how to deploy and use Mistral AI's Large Language Models with our comprehensive documentation, guides, and tutorials.", { context: 'Meta description for the documentation home page' });
  return {
    title: tabTitle,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: 'https://docs.mistral.ai',
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_DIMENSIONS.width,
          height: OG_IMAGE_DIMENSIONS.height,
          alt: 'Mistral AI Documentation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);

  return (
    <div className="space-y-16 not-prose pb-20">
      {/* Hero Section */}
      <div className="relative flex flex-col xl:flex-row gap-8 xl:gap-16 mt-12 mb-12 items-center justify-between w-full overflow-visible">
        <div className="flex flex-col gap-6 z-10 flex-1 max-w-full xl:max-w-[60%]">
          <Heading>
            <HeadingTitle
              className="font-black tracking-tight leading-[1.1] text-foreground max-xl:text-center text-balance text-[clamp(1.5rem,4vw,3rem)]"
              size="h1"
              as="h1"
            >
              {l.text('Mistral AI Documentation', { context: 'Main heading for the documentation home page' })}
            </HeadingTitle>
          </Heading>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl leading-relaxed font-medium max-xl:text-center max-xl:mx-auto">
            {l.text('All our documentation in your hands: build, customize, and deploy AI, your way.', { context: 'Subtitle for the documentation home page' })}
          </p>
        </div>

        <div className="hidden xl:flex w-[40%] justify-end xl:pr-8">
          <HeroCards />
        </div>
      </div>


      {/* Discover our platform */}
      <section id="overview" className="flex flex-col gap-6">
        <SectionTab sectionId="overview">{l.text('Discover our platform', { context: 'Heading for the discover our platform section on the home page' })}</SectionTab>
        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          {l.text('Three products, one platform. Pick where you want to start.', { context: 'Intro line above the three-product bullet list on the home page' })}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: l.text('Vibe', { context: 'Product name on the discover-our-platform card on the home page' }),
              description: l.text('The unified agent for productivity and coding. Chat with it on the web or mobile, or run it in your terminal and editor.', { context: 'Description of Vibe on the discover-our-platform card on the home page' }),
              logo: PRODUCT_LOGOS['vibe'],
              href: '/vibe/overview',
              hoverText: 'group-hover:text-[#FA500F]',
              hoverBg: 'group-hover:bg-[#FA500F]',
              hoverBorder: 'hover:border-[#FA500F]/50',
            },
            {
              title: l.text('Studio', { context: 'Product name on the discover-our-platform card on the home page' }),
              description: l.text('The developer console and the Mistral API. Keys, the Playground, evaluations, agents, and SDKs to ship applications.', { context: 'Description of Studio on the discover-our-platform card on the home page' }),
              logo: PRODUCT_LOGOS['studio'],
              href: '/studio-api/overview',
              hoverText: 'group-hover:text-[#0082E6]',
              hoverBg: 'group-hover:bg-[#0082E6]',
              hoverBorder: 'hover:border-[#0082E6]/50',
            },
            {
              title: l.text('Admin', { context: 'Product name on the discover-our-platform card on the home page' }),
              description: l.text("The control plane for organization setup, billing, SSO, Workspaces, and access policies.", { context: 'Description of Admin on the discover-our-platform card on the home page' }),
              logo: PRODUCT_LOGOS['admin'],
              href: '/admin/security-access/back-office',
              hoverText: 'group-hover:text-[#4a4a5e]',
              hoverBg: 'group-hover:bg-[#4a4a5e]',
              hoverBorder: 'hover:border-[#4a4a5e]/50',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline ${item.hoverBorder}`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />
              <div className="flex flex-col h-full gap-3 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="mb-2">
                    <Image src={item.logo} alt={item.title} width={item.logo === PRODUCT_LOGOS['admin'] ? 39 : 36} height={item.logo === PRODUCT_LOGOS['admin'] ? 39 : 36} className="rounded-lg" />
                  </div>
                  <div className={`shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground ${item.hoverBg} group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110`}>
                    <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className={`font-bold text-xl tracking-tight leading-tight text-foreground ${item.hoverText} transition-colors`}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-end">
          <Button size="sm" asChild>
            <Link href="/getting-started/platform-overview">
              {l.text('Compare our products', { context: 'Call to compare Mistral products on the platform overview page' })} <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </section>


      {/* Latest models */}
      <section id="latest-models" className="flex flex-col gap-6">
        <SectionTab sectionId="latest-models">{l.text('Latest models', { context: 'Heading for the latest models section on the home page' })}</SectionTab>

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


      {/* Quickstarts */}
      <section id="quickstarts" className="flex flex-col gap-6">
        <SectionTab sectionId="quickstarts">{l.text('Quickstarts', { context: 'Heading for the quickstarts section on the home page' })}</SectionTab>
        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          {l.text('Self-contained walkthroughs grouped by product and role. Most take 15 minutes or less.', { context: 'Intro line for the quickstarts section on the home page' })}
        </p>

        <QuickstartsFilterableGrid />
      </section>

    </div>
  );
}
