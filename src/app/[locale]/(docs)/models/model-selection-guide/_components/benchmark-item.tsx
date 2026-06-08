'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ModelSlug,
  nonLegacyModels,
  getModelUrl,
  AVAILABLE_FEATURES,
  AVAILABLE_ENDPOINTS,
  Model,
  EndpointKey,
  EndpointIcon,
} from '@/schema';
import { featureLabel } from '@/schema/models/i18n';
import type { Lingo } from '@lingo.dev/react';
import { ModelAvatar } from '@/components/model/avatar';
import { AVATAR_ICONS, getModelIconFallback } from '@/lib/icons';
import { getModelColorFallback, MODEL_COLORS } from '@/lib/colors';
import {
  ThunderIcon,
  LampIcon,
  ChatIcon,
  PictureIcon,
  ArrowRightIcon,
  ScanIcon,
  CalculatorIcon,
  ComputerIcon,
  PageIcon,
  MusicIcon,
  CheckIcon,
} from '@/components/icons/pixel';
import MicrophoneIcon from '@/components/icons/pixel/microphone';
import { Link } from '@/i18n/navigation.client';
import { cn } from '@/lib/utils';
import { Prose } from '@/components/common/prose';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { baseMarkdownComponents } from '@/components/markdown/base';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import InfoHint from '@/components/icons/info-hint';
import { useLingo } from '@lingo.dev/react';

interface BenchmarkTableProps {
  /**
   * The model identifier or slug to find the model by
   */
  modelIdentifierOrSlug:
    | ModelSlug
    | Model['identifiers']['apiNames'][number]
    | NonNullable<Model['identifiers']['aliases']>[number];
}
export const BenchmarkTable = ({
  modelIdentifierOrSlug,
}: {
  modelIdentifierOrSlug:
    | ModelSlug
    | Model['identifiers']['apiNames'][number]
    | NonNullable<Model['identifiers']['aliases']>[number];
}) => {
  const l = useLingo();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const model = nonLegacyModels.find(model => {
    if (model.slug === modelIdentifierOrSlug) return true;
    if (model.identifiers.apiNames.includes(modelIdentifierOrSlug)) return true;
    if (model.identifiers.aliases?.includes(modelIdentifierOrSlug)) return true;
    return false;
  });
  const [mdxSource, setMdxSource] = useState<any>(null);
  const described = model?.describe(l);
  const descriptionText = described?.shortDescription || described?.description;

  useEffect(() => {
    if (!descriptionText) {
      setMdxSource(null);
      return;
    }
    let cancelled = false;
    serialize(descriptionText).then(result => {
      if (!cancelled) setMdxSource(result);
    });
    return () => {
      cancelled = true;
    };
  }, [descriptionText]);

  if (!model) return <NoModel />;

  const modelColorVar =
    MODEL_COLORS[
      model.avatar?.backgroundColor || getModelColorFallback(model.name)
    ];
  const modelUrl = getModelUrl(model);

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col gap-6 w-full relative model-benchmark-item"
      style={
        {
          '--model-color': modelColorVar,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col gap-4">
        <div className="mx-[5px]">
          <ModelHeader model={model} />
        </div>
        <div className="h-[48px] px-2 overflow-hidden">
          <Prose className="text-sm leading-normal text-foreground/50 line-clamp-3">
            {mdxSource ? (
              <MDXRemote {...mdxSource} components={baseMarkdownComponents} />
            ) : (
              <p>{descriptionText}</p>
            )}
          </Prose>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 items-center py-2">
        <div className="flex flex-col gap-2 w-full min-h-[88px]">
          {modelUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="justify-between"
            >
              <Link href={modelUrl}>
                <p className="font-semibold text-sm text-foreground/70">
                  {l.text('Learn more', { context: 'Button to open the full AI model page' })}
                </p>
                <ArrowRightIcon className="size-3.5 opacity-50" />
              </Link>
            </Button>
          )}
          {model.playground && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="justify-between"
            >
              <a href={model.playground} target="_blank" rel="noopener noreferrer">
                <p className="font-semibold text-sm">{l.text('Try in Playground', { context: 'Button to test the AI model in the playground' })}</p>
                <ArrowRightIcon className="w-[14px] h-[14px] text-primary-foreground" />
              </a>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <BenchmarkBox label={l.text('INFO', { context: 'Section heading for benchmark summary' })}>
            <BenchmarkRow label={l.text('Speed', { context: 'Row label for AI model speed' })}>
              {renderRatingIcons(model.ratings.speed, 4, ThunderIcon)}
            </BenchmarkRow>

            <BenchmarkRow label={l.text('PERFORMANCE', { context: 'Row label for AI model capability level' })} labelClassName="text-foreground">
              {renderRatingIcons(
                model.ratings.performance,
                4,
                LampIcon,
                'primary'
              )}
            </BenchmarkRow>

            <BenchmarkRow label={l.text('INPUT', { context: 'Row label for supported input types' })}>
              {renderModalityIcons(model.capabilities.input, [
                'text',
                'image',
                'audio',
                'document',
              ])}
            </BenchmarkRow>

            <BenchmarkRow label={l.text('OUTPUT', { context: 'Row label for supported output types' })}>
              {renderModalityIcons(model.capabilities.output, [
                'text',
                'image',
                'audio',
                'embeddings',
                'scores',
                'reasoning',
              ])}
            </BenchmarkRow>
          </BenchmarkBox>

          <BenchmarkBox label=" " contentClassName="min-h-[96px]">
            {model.pricing.type === 'custom' &&
            model.pricing.input.length > 0 ? (
              <BenchmarkRow label={l.text('INPUT', { context: 'Row label for input token price' })} data-benchmark-pricing>
                <div className="flex flex-col items-end text-right">
                  {model.pricing.input.map((entry, i) => (
                    <span
                      data-benchmark-pricing-index={i + 1}
                      key={i}
                      className="font-mono font-medium text-sm text-foreground/30"
                    >
                      {`$${formatPrice(entry.price)}${entry.denominator || ''}`}
                    </span>
                  ))}
                </div>
              </BenchmarkRow>
            ) : (
              <BenchmarkRow label={l.text('INPUT', { context: 'Row label for input token price' })} value={`$${getInputPrice(model)}`} />
            )}
            <BenchmarkRow label={l.text('OUTPUT', { context: 'Row label for output token price' })} value={`$${getOutputPrice(model)}`} />
          </BenchmarkBox>

          <BenchmarkBox label={l.text('FEATURES', { context: 'Section heading for supported API features' })}>
            {getFeatures(model, l).map(feature => {
              return (
                <BenchmarkRow
                  key={feature.key}
                  label={feature.name}
                  disabled={!feature.available}
                >
                  <CheckIcon
                    className={cn(
                      'w-6 h-6',
                      feature.available
                        ? 'text-foreground'
                        : 'text-foreground/30'
                    )}
                  />
                </BenchmarkRow>
              );
            })}
          </BenchmarkBox>
        </div>

        <BenchmarkAdditionalInfo model={model} />

        {/* Learn more about this model */}
        <div className="flex justify-center py-2">
          <Button
            variant="link"
            asChild
            className="gap-1 text-sm text-foreground/70 hover:text-foreground"
          >
            <Link href={modelUrl}>
              {l.text('Learn more about this model', { context: 'Link to the full AI model page' })}
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Components
const BenchmarkBox = ({
  label,
  children,
  className,
  contentClassName,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) => {
  return (
    <div className={cn('flex flex-col gap-4 p-2', className)}>
      <div className="flex flex-col gap-2">
        <p className="font-mono font-semibold text-xs text-foreground/30 uppercase tracking-[0.24px]">
          {label}
        </p>
        <div className="h-px bg-foreground/10 w-full" />
      </div>
      <div className={cn('flex flex-col gap-4', contentClassName)}>
        {children}
      </div>
    </div>
  );
};

const BenchmarkRow = ({
  label,
  value,
  children,
  labelClassName,
  valueClassName,
  className,
  disabled,
  ...props
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  className?: string;
  disabled?: boolean;
} & React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-2 py-1',
        disabled && 'opacity-20',
        className
      )}
      {...props}
    >
      <p
        className={cn(
          'font-mono font-semibold text-sm uppercase flex-1',
          labelClassName || 'text-foreground'
        )}
      >
        {label}
      </p>
      {children ? (
        children
      ) : (
        <p
          className={cn(
            'font-mono font-medium text-sm text-foreground tracking-normal',
            valueClassName
          )}
        >
          {value}
        </p>
      )}
    </div>
  );
};

const BenchmarkAdditionalInfo = ({
  model,
}: {
  model: (typeof nonLegacyModels)[0];
}) => {
  const l = useLingo();
  const allIdentifiers = [
    ...model.identifiers.apiNames,
    ...(model.identifiers.aliases || []),
  ];
  const label = allIdentifiers.length <= 1
    ? l.text('ID', { context: 'Row label for a single API model identifier' })
    : l.text('IDS', { context: 'Row label for multiple API model identifiers' });

  return (
    <BenchmarkBox label={l.text('Additional Info', { context: 'Section heading for additional AI model metadata' })} className="w-full">
      {/* IDs Row with Tooltip */}
      <BenchmarkRow label={label}>
        <div className="flex items-center gap-1 justify-end">
          {allIdentifiers.length > 0 && (
            <>
              <code className="bg-background ring-1 ring-border rounded px-1.5 py-0.5 text-xs font-mono font-semibold text-foreground">
                {allIdentifiers[0]}
              </code>
              {allIdentifiers.length > 1 && (
                <Tooltip>
                  <TooltipTrigger>
                    <InfoHint />
                  </TooltipTrigger>
                  <TooltipContent align="end" side="top">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <p className="font-semibold">{l.text('All IDs:', { context: 'Tooltip heading for all API model identifiers' })}</p>
                      {allIdentifiers.map((id, index) => (
                        <p key={index} className="text-xs">
                          {id}
                          {model.identifiers.aliases?.includes(id) &&
                            l.text(' (alias)', { context: 'Suffix marking an API model identifier as an alias' })}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </BenchmarkRow>

      {/* License Row */}
      {model.weights?.[0]?.license && (
        <BenchmarkRow label={l.text('LICENSE', { context: 'Row label for the open-weights license' })}>
          <div className="flex flex-wrap gap-1 justify-end">
            {model.weights[0].licenseUrl ? (
              <a
                href={model.weights[0].licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-soft hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {model.weights[0].license}
                <span className="font-mono">↗</span>
              </a>
            ) : (
              <span>{model.weights[0].license}</span>
            )}
          </div>
        </BenchmarkRow>
      )}

      {/* Weights Row */}
      {model.weights?.[0]?.name && (
        <BenchmarkRow label={l.text('WEIGHTS', { context: 'Row label for downloadable model weights' })}>
          <div className="flex flex-wrap gap-1 justify-end">
            {model.weights[0].url ? (
              <a
                href={model.weights[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-soft hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {model.weights[0].name}
                <span className="font-mono">↗</span>
              </a>
            ) : (
              <span>{model.weights[0].name}</span>
            )}
          </div>
        </BenchmarkRow>
      )}

      {/* Parameters Row */}
      {model.weights?.[0]?.parameters && (
        <BenchmarkRow label={l.text('PARAMETERS', { context: 'Row label for total model parameters' })}>
          <div className="flex flex-wrap gap-1 justify-end">
            <span>{model.weights[0].parameters}B</span>
          </div>
        </BenchmarkRow>
      )}

      {/* Active Parameters Row */}
      {model.weights?.[0]?.active && (
        <BenchmarkRow label={l.text('ACTIVE', { context: 'Row label for active mixture-of-experts parameters' })}>
          <div className="flex flex-wrap gap-1 justify-end">
            <span>{model.weights[0].active}B</span>
          </div>
        </BenchmarkRow>
      )}

      {/* GPU RAM Row with Tooltip */}
      {model.weights?.[0]?.minGpuRam && (
        <BenchmarkRow label={l.text('GPU RAM (GB)', { context: 'Row label for minimum GPU memory required' })}>
          <div className="flex items-center gap-1 justify-end">
            <span>
              {(() => {
                const values = [
                  model.weights[0].minGpuRam.bf16 !== null
                    ? parseFloat(model.weights[0].minGpuRam.bf16)
                    : null,
                  model.weights[0].minGpuRam.fp8 !== null
                    ? parseFloat(model.weights[0].minGpuRam.fp8)
                    : null,
                  model.weights[0].minGpuRam.fp4 !== null
                    ? parseFloat(model.weights[0].minGpuRam.fp4)
                    : null,
                  model.weights[0].minGpuRam.fp4_16 !== null
                    ? parseFloat(model.weights[0].minGpuRam.fp4_16)
                    : null,
                ].filter((val): val is number => val !== null);
                return values.length > 0
                  ? `${Math.max(...values)} - ${Math.min(...values)}`
                  : 'N/A';
              })()}
            </span>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 justify-end">
                <InfoHint />
              </TooltipTrigger>
              <TooltipContent align="end" side="top" arrowClassName="">
                <div className="flex flex-col gap-1 max-w-[160px]">
                  <p className="mt-3">
                    {l.text('Approximate minimum required GB for different quantization formats.', { context: 'Intro text for minimum GPU memory by quantization format' })}
                  </p>
                  {model.weights[0].minGpuRam.bf16 !== null && (
                    <p>
                      <strong>{l.text(' - BF16 & Full Context:', { context: 'Label for BF16 memory at full context length' })}</strong>{' '}
                      {model.weights[0].minGpuRam.bf16}
                    </p>
                  )}
                  {model.weights[0].minGpuRam.fp8 !== null && (
                    <p>
                      <strong>{l.text(' - FP8 & 1/2 Context:', { context: 'Label for FP8 memory at half context length' })}</strong>{' '}
                      {model.weights[0].minGpuRam.fp8}
                    </p>
                  )}
                  {model.weights[0].minGpuRam.fp4 !== null && (
                    <p>
                      <strong>{l.text(' - FP4 & 1/4 context:', { context: 'Label for FP4 memory at quarter context length' })}</strong>{' '}
                      {model.weights[0].minGpuRam.fp4}
                    </p>
                  )}
                  {model.weights[0].minGpuRam.fp4_16 !== null && (
                    <p>
                      <strong>{l.text(' - FP4 & 16k context:', { context: 'Label for FP4 memory at 16k context length' })}</strong>{' '}
                      {model.weights[0].minGpuRam.fp4_16}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </BenchmarkRow>
      )}
    </BenchmarkBox>
  );
};

// Helpers
const getInputPrice = (model: Model) => {
  if (model.pricing.type === 'flat') {
    return formatPrice(model.pricing.price);
  }
  if (model.pricing.type === 'range') {
    return formatPrice(model.pricing.input);
  }
  if (model.pricing.type === 'custom' && model.pricing.input.length > 0) {
    return model.pricing.input
      .map(entry => `${formatPrice(entry.price)}${entry.denominator || ''}`)
      .join(', ');
  }
  return '-';
};

const getOutputPrice = (model: Model) => {
  if (model.pricing.type === 'flat') {
    return formatPrice(model.pricing.price);
  }
  if (model.pricing.type === 'range') {
    return formatPrice(model.pricing.output);
  }
  if (model.pricing.type === 'custom' && model.pricing.output.length > 0) {
    return model.pricing.output
      .map(entry => `${formatPrice(entry.price)}${entry.denominator || ''}`)
      .join(', ');
  }
  return '-';
};

const formatContextLength = (contextLength?: string | null) => {
  if (!contextLength) return '-';
  return contextLength.replace('k', '.000').replace('K', '.000');
};

const renderRatingIcons = (
  rating: number,
  maxRating: number,
  Icon: React.ComponentType<{ className?: string }>,
  filledColor?: string
) => {
  return (
    <div className="flex items-center space-x-1.5 md:-space-x-1 2xl:space-x-1.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const isFilled = i < Math.floor(rating);
        const useOrange = isFilled && filledColor === 'primary';
        return (
          <div
            key={i}
            className={cn(
              'w-[18px] h-[18px]',
              useOrange
                ? 'text-primary'
                : isFilled
                  ? 'text-foreground'
                  : 'text-foreground/30'
            )}
          >
            <Icon className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
};

const renderModalityIcons = (
  modalities: string[],
  availableModalities: string[]
) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    text: ChatIcon,
    image: PictureIcon,
    vision: PictureIcon,
    audio: MicrophoneIcon,
    reasoning: LampIcon,
    document: PageIcon,
    embeddings: ScanIcon,
    scores: CalculatorIcon,
  };

  return (
    <div className="flex gap-[6px] items-center">
      {availableModalities.map(modality => {
        const Icon = iconMap[modality];
        if (!Icon) return null;
        const isAvailable =
          modalities.includes(modality) ||
          (modality === 'image' && modalities.includes('vision'));
        return (
          <Icon
            key={modality}
            className={cn(
              'w-[18px] h-[18px]',
              isAvailable ? 'text-foreground' : 'text-foreground/30'
            )}
          />
        );
      })}
    </div>
  );
};

const getFeatures = (model: Model, l: Lingo) => {
  const featureKeys = Object.keys(AVAILABLE_FEATURES) as Array<
    keyof typeof AVAILABLE_FEATURES
  >;
  return featureKeys.map(key => {
    const isAvailable = model.capabilities.features.includes(key);
    return {
      key,
      name: featureLabel(key, l).toUpperCase(),
      available: isAvailable,
    };
  });
};

const getEndpointIcon = (icon: EndpointIcon) => {
  const iconMap: Record<
    EndpointIcon,
    React.ComponentType<{ className?: string }>
  > = {
    [EndpointIcon.CHAT]: ChatIcon,
    [EndpointIcon.EMBEDDING]: ScanIcon,
    [EndpointIcon.CALCULATOR]: CalculatorIcon,
    [EndpointIcon.AUDIO]: MusicIcon,
    [EndpointIcon.COMPUTER]: ComputerIcon,
  };
  return iconMap[icon] || ChatIcon;
};

const formatPrice = (price: number) => {
  return price
    .toFixed(4)
    .replace(/(\.\d*[1-9])0+$|\.0+$/, '$1')
    .replace(/\.$/, '');
};

const NoModel = () => {
  const l = useLingo();
  return (
    <div className="flex-1 h-full flex rounded-xl border-dashed border-2 border-border/70 relative">
      <p className="text-sm text-foreground/50 sticky top-(--header) h-12 w-full py-2 flex items-center justify-center">
        {l.text('Select a model to see the benchmark', { context: 'Prompt to choose an AI model for comparison' })}
      </p>
    </div>
  );
};

export const ModelHeader = ({
  model: _model,
}: {
  model: Model | string | ModelSlug;
}) => {
  const model =
    typeof _model === 'string'
      ? nonLegacyModels.find(model => model.slug === _model)
      : _model;
  if (!model) return null;
  const modelIcon = model.avatar?.icon || getModelIconFallback(model.name);

  const modelColorVar =
    MODEL_COLORS[
      model.avatar?.backgroundColor || getModelColorFallback(model.name)
    ];
  const cardStyle = {
    '--model-color': modelColorVar,
  } as React.CSSProperties;
  const iconPath = AVATAR_ICONS[modelIcon];
  return (
    <div
      className="rounded-md h-[90px] overflow-hidden ring ring-model ring-offset-4 ring-offset-background sticky top-0"
      style={cardStyle}
    >
      <div className="bg-model h-full flex items-center pr-4">
        <div className="size-15 flex-shrink-0">
          <ModelAvatar
            src={iconPath}
            alt={`${model.name} icon`}
            className="size-full shadow-none"
            size="lg"
            style={cardStyle}
          />
        </div>
        <div className="flex flex-col items-start">
          <h4 className="text-foreground text-lg font-bold 2xl:text-xl whitespace-nowrap">
            {model.name}
          </h4>
          <span className="font-mono text-[15px] leading-none tracking-[-0.31px] text-foreground/50">
            v{model.version}
          </span>
        </div>
      </div>
    </div>
  );
};
