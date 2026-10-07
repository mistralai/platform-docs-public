'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatPrice, ModelPricing, PricingCurrency } from '@/schema/models';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { PricingCurrencyToggle } from '@/components/model/pricing-currency-toggle';
import { usePricingCurrency } from '@/hooks/use-pricing-currency';
import { useLingo } from '@lingo.dev/react';
import type { Locale } from '@/i18n/config';

interface PriceProps {
  isRetired?: boolean;
  pricing: ModelPricing;
  className?: string;
  locale: Locale;
  layout?: 'default' | 'stacked';
}

export function PriceValue({
  value,
  label,
  unit,
  tooltip,
  currency,
  orientation = 'column',
  originalPrice,
  discountTooltip,
}: {
  value: number;
  label: string;
  unit?: string;
  tooltip?: string;
  currency: PricingCurrency;
  orientation?: 'column' | 'row';
  originalPrice?: number;
  discountTooltip?: React.ReactNode;
}) {
  const l = useLingo();
  const hasDiscount = originalPrice !== undefined;
  const effectiveTooltip = hasDiscount && discountTooltip ? discountTooltip : tooltip;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'min-w-0 cursor-help',
            orientation === 'row'
              ? 'grid grid-cols-[minmax(5rem,max-content)_minmax(7rem,1fr)] items-start gap-x-8 py-2'
              : 'flex flex-col gap-4 px-3 first:pl-0 last:!pr-0'
          )}
        >
          {/* On sale: the struck-through original price sits on its own line above the sale price. */}
          <div className={cn('flex gap-1.5', hasDiscount ? 'flex-col items-start' : 'items-baseline')}>
            {hasDiscount ? (
              <>
                <del className="text-foreground/30 text-sm font-semibold font-mono uppercase !leading-tight line-through whitespace-nowrap">
                  <span className="sr-only">{l.text('Original price:', { context: 'Screen reader prefix for the struck-through regular price of a model on sale' })} </span>
                  {formatPrice(originalPrice, currency)}
                </del>
                <ins className="no-underline text-primary-soft text-base font-semibold font-mono uppercase !leading-tight whitespace-nowrap">
                  <span className="sr-only">{l.text('Sale price:', { context: 'Screen reader prefix for the temporary discounted price of a model on sale' })} </span>
                  {formatPrice(value, currency)}
                </ins>
              </>
            ) : (
              <span className="text-primary-soft text-base font-semibold font-mono uppercase !leading-none">
                {formatPrice(value, currency)}
              </span>
            )}
          </div>
          <p className="text-xs leading-tight uppercase text-foreground/30 font-mono font-semibold">
            {label}
            {unit && <span className="block whitespace-nowrap">{unit}</span>}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px]">{effectiveTooltip}</TooltipContent>
    </Tooltip>
  );
}

export function Price({ pricing, className, layout = 'default' }: PriceProps) {
  const l = useLingo();
  const [currency, setCurrency] = usePricingCurrency();
  const inputCostLabel = l.text('Input Cost', { context: 'Tooltip label for input token price' });
  const outputCostLabel = l.text('Output Cost', { context: 'Tooltip label for output token price' });
  const onSale =
    !pricing.free &&
    pricing.type === 'custom' &&
    [...pricing.input, ...pricing.output].some(entry => entry.originalPrice !== undefined);
  const launchDiscountTooltip = (
    <span className="whitespace-nowrap">
      {l.text('Launch pricing: 50% off for 2 weeks.', { context: 'Tooltip explaining the launch discount on the model card price' })}
    </span>
  );

  const renderContent = () => {
    if (pricing.free) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <span className="text-orange-500 text-lg font-semibold font-mono uppercase leading-[1]">
                {l.text('Free', { context: 'Free price label' })}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px]">
            {l.text('Free for a limited amount of time.', { context: 'Note that the AI model is temporarily free' })}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (pricing.type === 'flat') {
      const price = pricing.price;
      return (
        <span className="text-primary-soft text-lg font-semibold font-mono uppercase leading-[1]">
          {formatPrice(price, currency)}
        </span>
      );
    }

    if (pricing.type === 'custom') {
      if (layout === 'stacked') {
        return (
          <div className="flex min-w-0 flex-col divide-y divide-foreground/30 divide-dashed">
            {pricing.input.map((input, i) => (
              <PriceValue
                key={`input-${input.denominator}-${i}`}
                value={input.price}
                originalPrice={input.originalPrice}
                discountTooltip={input.originalPrice !== undefined ? launchDiscountTooltip : undefined}
                tooltip={input.label ?? inputCostLabel}
                label={input.label ?? input.denominator}
                unit={input.label ? input.denominator : undefined}
                currency={currency}
                orientation="row"
              />
            ))}
            {pricing.output.map((output, i) => (
              <PriceValue
                key={`output-${output.denominator}-${i}`}
                value={output.price}
                originalPrice={output.originalPrice}
                discountTooltip={output.originalPrice !== undefined ? launchDiscountTooltip : undefined}
                tooltip={output.label ?? outputCostLabel}
                label={output.label ?? output.denominator}
                unit={output.label ? output.denominator : undefined}
                currency={currency}
                orientation="row"
              />
            ))}
          </div>
        );
      }
    }

    return (
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {pricing.type === 'range' ? (
          <>
            <PriceValue
              value={pricing.input}
              tooltip={inputCostLabel}
              label={pricing.denominator}
              currency={currency}
            />
            <PriceValue
              value={pricing.output}
              tooltip={outputCostLabel}
              label={pricing.denominator}
              currency={currency}
            />
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-wrap divide-x divide-foreground/30 divide-dashed">
              {pricing.input.map((input, i) => (
                <PriceValue
                  key={`${input.denominator}-${i}`}
                  value={input.price}
                  originalPrice={input.originalPrice}
                  discountTooltip={input.originalPrice !== undefined ? launchDiscountTooltip : undefined}
                  tooltip={inputCostLabel}
                  label={input.denominator}
                  currency={currency}
                />
              ))}
            </div>
            <div className="flex min-w-0 flex-wrap first:pl-0 last:!pr-0 divide-x divide-foreground/30 divide-dashed">
              {pricing.output.map((output, i) => (
                <PriceValue
                  key={`${output.denominator}-${i}`}
                  value={output.price}
                  originalPrice={output.originalPrice}
                  discountTooltip={output.originalPrice !== undefined ? launchDiscountTooltip : undefined}
                  tooltip={outputCostLabel}
                  label={output.denominator}
                  currency={currency}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {!pricing.free && (
        <div className="flex flex-wrap items-center gap-2">
          <PricingCurrencyToggle
            value={currency}
            onValueChange={setCurrency}
            className="w-fit self-start"
          />
          {onSale && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  size="xs"
                  tabIndex={0}
                  className="font-mono uppercase text-[11px] cursor-help"
                >
                  {l.text('Sale price', { context: 'Badge marking a model whose listed price is a temporary discount' })}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-left">
                {l.text('Temporary sale price. The struck-through amount is the original price.', { context: 'Tooltip explaining the sale price badge in the model pricing table' })}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      {renderContent()}
    </div>
  );
}
