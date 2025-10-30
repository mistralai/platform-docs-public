import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { models, findModelBySlug, isLegacyModel } from '@/schema';
import { ThunderIcon, LampIcon } from '@/components/icons/pixel';
import { AVATAR_ICONS, getModelIconFallback } from '@/lib/icons';
import { getModelColorFallback, MODEL_COLORS } from '@/lib/colors';
import { ModelAvatar } from '@/components/model/avatar';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { SectionLabel } from './components/section-label';
import { StatRating } from './components/stat-rating';
import { Modalities } from './components/modalities';
import { ModelTabs } from './components/model-tabs';
import { Price } from './components/price';
import RelatedModels from './components/related-models';
import Image from 'next/image';
import ArrowReversibleIcon from '@/components/icons/pixel/arrow-reversible';
import { cn } from '@/lib/utils';
import DeprecationNotice from './components/deprecation-notice';
import { getOGImageUrl } from '@/components/og/helpers';
import { ModelCard, ModelCardInner } from './components/model-card';
import { ApiNamesBadges } from './components/api-names-badges';
import InfoHint from '@/components/icons/info-hint';
import Link from 'next/link';
import { MISTRAL_API_PRICING_URL } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Prose } from '@/components/common/prose';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { markdownComponents } from '@/components/markdown';

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all models
export async function generateStaticParams() {
  return models.map(model => ({
    slug: model.slug,
  }));
}

// Generate metadata for each model page
export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = findModelBySlug(slug);

  if (!model) {
    return {
      title: 'Model Not Found',
      description: 'The requested model could not be found.',
    };
  }

  const ogImageUrl = getOGImageUrl({
    path: 'model',
    title: model.name,
    description: model.description,
    eyebraw: model.version ? `v${model.version}` : 'MODELS',
    image: '',
  });

  return {
    title: `${model.name} - Mistral AI`,
    description: model.description,
    openGraph: {
      title: `${model.name} - Mistral AI`,
      description: model.description,
      url: `https://docs.mistral.ai/models/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${model.name} - Mistral AI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${model.name} - Mistral AI`,
      description: model.description,
      images: [ogImageUrl],
    },
  };
}

const MAX_API_NAMES = 1;

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = findModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const isLegacy = isLegacyModel(model);

  const modelIcon = model.avatar?.icon || getModelIconFallback(model.name);

  const modelColorVar =
    MODEL_COLORS[
      isLegacy
        ? 'gray'
        : model.avatar?.backgroundColor || getModelColorFallback(model.name)
    ];

  // Get the icon path
  const iconPath = AVATAR_ICONS[modelIcon];
  const hasLargePricing =
    model.pricing.type === 'custom' &&
    model.pricing.input.length + model.pricing.output.length > 2;

  return (
    <div className="md:pt-8 text-foreground not-prose relative flex flex-col md:gap-24 gap-16 flex-1 w-full min-h-[calc(100%_-_64px)]">
      <div className="flex flex-col xl:flex-row gap-4 w-full flex-1">
        <div className="rounded-md self-start p-1 border">
          <ModelAvatar
            pixelEffect={!isLegacy}
            size="3xl"
            src={iconPath}
            alt={`${model.name} icon`}
            className="z-2"
            style={{
              backgroundColor: modelColorVar,
            }}
          />
        </div>

        <div className="space-y-8 flex-1">
          {/* Header Section */}
          <div className="space-y-2">
            <ModelCard className="relative flex flex-col gap-6 p-5">
              <Image
                className="absolute size-24 top-0 right-0 -translate-y-full pixelated pointer-events-none"
                src="/assets/sprites/cat_idle.gif"
                alt="Cat"
                width={224}
                height={224}
              />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-foreground/50">
                  {model.releaseDate}
                </span>
                <span className="text-xs font-mono text-foreground/20">
                  v{model.version}
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 lg:gap-10 items-start md:items-end">
                <Heading className="gap-1 self-start md:basis-[400px] flex-1 shrink">
                  <HeadingTitle as="h1" size="h3">
                    {model.name}
                  </HeadingTitle>
                  <Prose className="md:text-pretty lg:text-balance">
                    <MDXRemote
                      source={model.description}
                      components={markdownComponents}
                    />
                  </Prose>
                </Heading>

                <ApiNamesBadges
                  names={model.identifiers.apiNames}
                  maxVisible={MAX_API_NAMES}
                />
              </div>
            </ModelCard>

            {/* capabilities and pricing desktop */}
            {!isLegacy && (
              <ModelCard
                className={cn(
                  'flex',
                  hasLargePricing ? 'max-xl:hidden' : 'max-lg:hidden'
                )}
                isLegacy={isLegacy}
              >
                {/* left side */}
                <ModelCardInner className="py-6 px-4">
                  <SectionBlock>
                    <SectionLabel icon={ThunderIcon}>Speed</SectionLabel>
                    <StatRating
                      isLegacy={isLegacy}
                      rating={model.ratings.speed}
                    />
                  </SectionBlock>

                  <SectionBlock>
                    <SectionLabel icon={LampIcon}>Performance</SectionLabel>
                    <StatRating
                      maxStars={4}
                      isLegacy={isLegacy}
                      rating={model.ratings.performance}
                    />
                  </SectionBlock>

                  {/* Modalities */}
                  <SectionBlock>
                    <SectionLabel icon={ArrowReversibleIcon}>
                      Modalities
                    </SectionLabel>
                    <Modalities
                      inputCapabilities={model.capabilities.input}
                      outputCapabilities={model.capabilities.output}
                    />
                  </SectionBlock>
                </ModelCardInner>

                {/* right side */}
                <ModelCardInner className="ml-auto border-l border-dashed pb-3 pt-3 px-4">
                  <div className="ml-auto items-start flex flex-col gap-2 justify-center">
                    <SectionLabel>
                      <span>Price</span>
                      <PriceTooltip />
                    </SectionLabel>
                    <Price
                      pricing={model.pricing}
                      isRetired={model.status === 'Retired'}
                    />
                  </div>
                </ModelCardInner>
              </ModelCard>
            )}

            {!isLegacy && (
              <ModelCard
                className={cn(hasLargePricing ? 'xl:hidden' : 'lg:hidden')}
                isLegacy={isLegacy}
              >
                <ModelCardInner>
                  <SectionBlock>
                    <SectionLabel icon={ThunderIcon}>Speed</SectionLabel>
                    <StatRating
                      isLegacy={isLegacy}
                      rating={model.ratings.speed}
                    />
                  </SectionBlock>

                  <SectionBlock>
                    <SectionLabel icon={LampIcon}>Performance</SectionLabel>
                    <StatRating
                      maxStars={4}
                      isLegacy={isLegacy}
                      rating={model.ratings.performance}
                    />
                  </SectionBlock>
                </ModelCardInner>
              </ModelCard>
            )}

            <ModelCard
              className={cn(hasLargePricing ? 'xl:hidden' : 'lg:hidden')}
              isLegacy={isLegacy}
            >
              <ModelCardInner>
                <SectionBlock>
                  <SectionLabel icon={ArrowReversibleIcon}>
                    Modalities
                  </SectionLabel>
                  <Modalities
                    inputCapabilities={model.capabilities.input}
                    outputCapabilities={model.capabilities.output}
                  />
                </SectionBlock>
              </ModelCardInner>
            </ModelCard>

            {!isLegacy && (
              <ModelCard
                className={cn(hasLargePricing ? 'xl:hidden' : 'lg:hidden')}
                isLegacy={isLegacy}
              >
                <ModelCardInner className="items-start flex flex-col gap-1">
                  <Price
                    pricing={model.pricing}
                    isRetired={model.status === 'Retired'}
                  />
                </ModelCardInner>
              </ModelCard>
            )}

            {isLegacy && <DeprecationNotice model={model} />}
          </div>

          {/* Tabs Section */}
          <ModelTabs model={model} />
        </div>
      </div>
      <RelatedModels
        initialModels={model.relatedModels}
        currentModelName={model.name}
      />
    </div>
  );
}

const SectionBlock = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>;
};

const PriceTooltip = () => {
  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger>
        <InfoHint />
      </TooltipTrigger>
      <TooltipContent className="max-w-[230px]">
        <p>
          The price may change depending on the features used.{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={MISTRAL_API_PRICING_URL}
            className="underline font-semibold text-primary"
          >
            Full Pricing Page<span className="text-primary">↗</span>
          </Link>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
