import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { models, findModelBySlug, isLegacyModel, Model } from '@/schema';
import { ThunderIcon, LampIcon, FlagIcon } from '@/components/icons/pixel';
import { AVATAR_ICONS, getModelIconFallback } from '@/lib/icons';
import { getModelColorFallback, MODEL_COLORS } from '@/lib/colors';
import { ModelAvatar } from '@/components/model/avatar';
import { Heading, HeadingTitle } from '@/components/layout/heading';
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
import { Link } from '@/i18n/navigation.client';
import { MISTRAL_API_PRICING_URL, MISTRAL_LEGAL_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Prose } from '@/components/common/prose';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { markdownComponents } from '@/components/markdown';
import { ModelTypeBadge } from '@/components/model/type-badge';
import { ArrowRightLeftIcon, ExternalLinkIcon } from 'lucide-react';
import { getLingo } from '@/i18n/server';
import { performanceRating, speedRating } from '@/schema/models/i18n';
import type { Locale } from '@/i18n/config';

interface ModelPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate static params for all models
export async function generateStaticParams() {
  return models.map(model => ({
    slug: model.slug,
  }));
}

export const dynamicParams = false;

// Generate metadata for each model page
export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const l = await getLingo(locale);
  const model = findModelBySlug(slug);

  if (!model) {
    return {
      title: l.text('Model Not Found', { context: 'Not found message for an AI model page' }),
      description: l.text('The requested model could not be found.', { context: 'Meta description for a missing AI model page' }),
    };
  }

  const { description } = model.describe(l);
  const ogImageUrl = getOGImageUrl({
    path: 'model',
    title: model.name,
    description,
    eyebraw: model.version ? `v${model.version}` : 'MODELS',
    image: '',
  });

  const title = l.text('{modelName} - Mistral AI', { values: { modelName: model.name }, context: 'Page title for an AI model' });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://docs.mistral.ai/models/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const ContextTooltip = async ({ locale }: { locale: Locale }) => {
  const l = await getLingo(locale);
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoHint />
      </TooltipTrigger>
      <TooltipContent className="max-w-[230px]">
        <p>
          {l.text('Context window size in tokens. This is the maximum number of input plus output tokens the model can process at once.', { context: 'Explanation of an AI model context window' })}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const OutputTokenTooltip = async ({ locale }: { locale: Locale }) => {
  const l = await getLingo(locale);
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoHint />
      </TooltipTrigger>
      <TooltipContent className="max-w-[230px]">
        <p>
          {l.text('Maximum number of output tokens per request. Requests exceeding this limit are rejected with an error.', { context: 'Explanation of an AI model output token limit' })}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const MAX_API_NAMES = 1;

export default async function ModelPage({ params }: ModelPageProps) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const l = await getLingo(locale);
  const model = findModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const { description } = model.describe(l);
  const speed = speedRating(model.ratings.speed, l);
  const performance = performanceRating(model.ratings.performance, l);
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
        <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            <CompareModelButton
              modelSlug={model.slug}
              modelsToCompare={model.modelsToCompare}
              locale={locale}
            />
            <LegalButton legal={model.legalButton} locale={locale} />
          </div>
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
                  {model.releaseDate && l.date(new Date(model.releaseDate), { dateStyle: undefined, year: 'numeric', month: 'long', day: 'numeric' })}
                  {model.bloglink && (
                    <Link
                      href={model.bloglink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#FF8205] underline hover:text-[#FA500F]"
                    >
                      {l.text('Blog', { context: 'Link to the AI model announcement blog post' })}
                    </Link>
                  )}
                  {model.paperlink && (
                    <Link
                      href={model.paperlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#FF8205] underline hover:text-[#FA500F]"
                    >
                      {l.text('Technical Report', { context: 'Link to the AI model technical report' })}
                    </Link>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {model.type && <ModelTypeBadge type={model.type} />}
                  <span className="text-xs font-mono text-foreground/20">
                    v{model.version}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 lg:gap-10 items-start md:items-end">
                <Heading className="gap-1 self-start md:basis-[400px] flex-1 shrink">
                  <HeadingTitle as="h1" size="h3">
                    {model.name}
                  </HeadingTitle>
                  <Prose className="md:text-pretty lg:text-balance">
                    <MDXRemote
                      source={description}
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
                    <SectionLabel icon={ThunderIcon}>{l.text('Speed', { context: 'Label for AI model speed' })}</SectionLabel>
                    <StatRating
                      isLegacy={isLegacy}
                      rating={speed}
                    />
                  </SectionBlock>

                  <SectionBlock>
                    <SectionLabel icon={LampIcon}>{l.text('Performance', { context: 'Label for AI model capability level' })}</SectionLabel>
                    <StatRating
                      maxStars={4}
                      isLegacy={isLegacy}
                      rating={performance}
                    />
                  </SectionBlock>

                  {/* Modalities */}
                  <SectionBlock>
                    <SectionLabel icon={ArrowReversibleIcon}>
                      {l.text('Modalities', { context: 'Label for supported input and output types' })}
                    </SectionLabel>
                    <Modalities
                      inputCapabilities={model.capabilities.input}
                      outputCapabilities={model.capabilities.output}
                      locale={locale}
                    />
                  </SectionBlock>
                </ModelCardInner>
                {(model.contextLength || model.outputTokenLimit) && (
                  <ModelCardInner className="border-l border-dashed pt-6 px-4 shrink ml-auto">
                    {model.contextLength && (
                      <SectionBlock>
                        <SectionLabel>
                          <span>{l.text('Context', { context: 'Label for an AI model context window' })}</span>
                          <ContextTooltip locale={locale} />
                        </SectionLabel>
                        <div className="text-lg font-bold font-mono text-primary-soft">
                          {model.contextLength}
                        </div>
                        <span />
                      </SectionBlock>
                    )}
                    {model.outputTokenLimit && (
                      <SectionBlock>
                        <SectionLabel>
                          <span>{l.text('Max output', { context: 'Label for an AI model maximum output token limit' })}</span>
                          <OutputTokenTooltip locale={locale} />
                        </SectionLabel>
                        <div className="text-lg font-bold font-mono text-primary-soft">
                          {model.outputTokenLimit}
                        </div>
                        <span />
                      </SectionBlock>
                    )}
                  </ModelCardInner>
                )}

                {/* right side */}
                <ModelCardInner className="ml-auto border-l border-dashed pb-3 pt-3 px-4">
                  <div className="ml-auto items-start flex flex-col gap-2 justify-center">
                    <SectionLabel>
                      <span>{l.text('Price', { context: 'Label for AI model pricing' })}</span>
                      <PriceTooltip locale={locale} />
                    </SectionLabel>
                    <Price
                      pricing={model.pricing}
                      isRetired={model.status === 'Retired'}
                      locale={locale}
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
                    <SectionLabel icon={ThunderIcon}>{l.text('Speed', { context: 'Label for AI model speed' })}</SectionLabel>
                    <StatRating
                      isLegacy={isLegacy}
                      rating={speed}
                    />
                  </SectionBlock>

                  <SectionBlock>
                    <SectionLabel icon={LampIcon}>{l.text('Performance', { context: 'Label for AI model capability level' })}</SectionLabel>
                    <StatRating
                      maxStars={4}
                      isLegacy={isLegacy}
                      rating={performance}
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
                    {l.text('Modalities', { context: 'Label for supported input and output types' })}
                  </SectionLabel>
                  <Modalities
                    inputCapabilities={model.capabilities.input}
                    outputCapabilities={model.capabilities.output}
                    locale={locale}
                  />
                </SectionBlock>
              </ModelCardInner>
            </ModelCard>
            {model.contextLength && (
              <ModelCard
                className={cn(hasLargePricing ? 'xl:hidden' : 'lg:hidden')}
                isLegacy={isLegacy}
              >
                <ModelCardInner>
                  <SectionBlock>
                    <SectionLabel>{l.text('Context', { context: 'Label for an AI model context window' })}</SectionLabel>
                    <div className="text-lg font-bold font-mono text-primary-soft">
                      {model.contextLength}
                    </div>
                  </SectionBlock>
                </ModelCardInner>
              </ModelCard>
            )}
            {model.outputTokenLimit && (
              <ModelCard
                className={cn(hasLargePricing ? 'xl:hidden' : 'lg:hidden')}
                isLegacy={isLegacy}
              >
                <ModelCardInner>
                  <SectionBlock>
                    <SectionLabel>{l.text('Max output', { context: 'Label for an AI model maximum output token limit' })}</SectionLabel>
                    <div className="text-lg font-bold font-mono text-primary-soft">
                      {model.outputTokenLimit}
                    </div>
                  </SectionBlock>
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
                    <SectionLabel>{l.text('Price', { context: 'Label for AI model pricing' })}</SectionLabel>
                    <Price
                      pricing={model.pricing}
                      isRetired={model.status === 'Retired'}
                      locale={locale}
                    />
                  </SectionBlock>
                </ModelCardInner>
              </ModelCard>
            )}

            {isLegacy && <DeprecationNotice model={model} locale={locale} />}
          </div>

          {/* Tabs Section */}
          <ModelTabs model={model} locale={locale} />
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

const PriceTooltip = async ({ locale }: { locale: Locale }) => {
  const l = await getLingo(locale);
  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger>
        <InfoHint />
      </TooltipTrigger>
      <TooltipContent className="max-w-[230px]">
        <p>
          {l.text('The price may change depending on the features used.', { context: 'Note that AI model pricing can vary by feature' })}{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={MISTRAL_API_PRICING_URL}
            className="underline font-semibold text-primary"
          >
            {l.text('Full Pricing Page', { context: 'Link to full AI model pricing' })}<span className="text-primary">↗</span>
          </Link>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const isLegalButtonPresent = ({ legal }: { legal: Model['legalButton'] }) => {
  return typeof legal === 'string' && legal !== '';
};
const LegalButton = async ({ legal, locale }: { legal: Model['legalButton']; locale: Locale }) => {
  if (!isLegalButtonPresent({ legal })) return null;

  const l = await getLingo(locale);
  const url = legal === 'DEFAULT' ? MISTRAL_LEGAL_URL : legal!;
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center justify-center gap-1">
          <FlagIcon className="size-4 relative" />
          <span>{l.text('Legal', { context: 'Label for AI model legal terms' })}</span>
        </span>
      </Link>
    </Button>
  );
};

const getCompareUrl = (models: string[]) => {
  const searchParams = new URLSearchParams();
  searchParams.set('models', models.join(','));
  return `/models/model-selection-guide?${searchParams.toString()}`;
};

const CompareModelButton = async ({
  modelSlug,
  modelsToCompare = [],
  locale,
}: {
  modelSlug: string;
  modelsToCompare?: string[];
  locale: Locale;
}) => {
  const l = await getLingo(locale);
  return (
    <Button variant="default" size="sm" asChild>
      <Link href={getCompareUrl([modelSlug, ...modelsToCompare])}>
        <ArrowRightLeftIcon className="size-4" />
        <span>{l.text('Compare', { context: 'Label for comparing an AI model with others' })}</span>
      </Link>
    </Button>
  );
};
